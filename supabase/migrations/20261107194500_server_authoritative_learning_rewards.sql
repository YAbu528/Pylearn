-- Server-authoritative learning reward evidence.
-- Additive migration. Apply to Pylearn-Dev first; production rollout is separate.
-- Does not backfill evidence or modify historical XP/achievement rows.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
grant usage on schema private to service_role;

create table private.learning_reward_evidence (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^(0|[1-9]|1[0-3])$'),
  event_type text not null check (event_type in ('quiz','lesson','challenge')),
  verification_version smallint not null check (verification_version > 0),
  verified_at timestamptz not null default now(),
  constraint learning_reward_evidence_user_lesson_event_key
    unique (user_id, lesson_id, event_type)
);

create index learning_reward_evidence_user_event_idx
  on private.learning_reward_evidence(user_id, event_type, verified_at desc);

alter table private.learning_reward_evidence enable row level security;
revoke all on table private.learning_reward_evidence from public, anon, authenticated, service_role;

-- Store attempt timestamps only; never store answer text or learner code.
create table private.learning_reward_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null check (lesson_id ~ '^(0|[1-9]|1[0-3])$'),
  event_type text not null check (event_type in ('quiz','challenge','lesson')),
  attempted_at timestamptz not null default now()
);

create index learning_reward_attempts_user_lesson_time_idx
  on private.learning_reward_attempts(user_id, lesson_id, event_type, attempted_at desc);

alter table private.learning_reward_attempts enable row level security;
revoke all on table private.learning_reward_attempts from public, anon, authenticated, service_role;

create or replace function private.reserve_learning_attempt(
  p_user_id uuid,
  p_lesson_id text,
  p_event_type text
)
returns boolean
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_count integer;
begin
  if coalesce(auth.jwt()->>'role','') <> 'service_role' then
    raise exception 'not_authorized';
  end if;

  if p_user_id is null
    or p_lesson_id is null
    or p_event_type is null
    or p_lesson_id !~ '^(0|[1-9]|1[0-3])$'
    or p_event_type not in ('quiz','lesson','challenge') then
    raise exception 'invalid_event';
  end if;

  perform pg_catalog.pg_advisory_xact_lock(
    pg_catalog.hashtextextended(
      p_user_id::text || ':' || p_lesson_id || ':' || p_event_type, 0
    )
  );

  delete from private.learning_reward_attempts a
  where a.user_id = p_user_id
    and a.lesson_id = p_lesson_id
    and a.event_type = p_event_type
    and a.attempted_at < now() - interval '10 minutes';

  select count(*)::integer into v_count
  from private.learning_reward_attempts a
  where a.user_id = p_user_id
    and a.lesson_id = p_lesson_id
    and a.event_type = p_event_type
    and a.attempted_at >= now() - interval '10 minutes';

  if v_count >= 10 then
    return false;
  end if;

  insert into private.learning_reward_attempts(user_id, lesson_id, event_type)
  values (p_user_id, p_lesson_id, p_event_type);

  return true;
end;
$function$;

revoke all on function private.reserve_learning_attempt(uuid,text,text)
  from public, anon, authenticated;
grant execute on function private.reserve_learning_attempt(uuid,text,text)
  to service_role;

create or replace function private.record_verified_learning_event(
  p_user_id uuid,
  p_lesson_id text,
  p_event_type text,
  p_verification_version smallint
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_evidence_id bigint;
  v_xp_event_id bigint;
  v_xp integer;
  v_today date := (now() at time zone 'Africa/Addis_Ababa')::date;
  v_stats public.user_stats%rowtype;
  v_lessons integer;
  v_quizzes integer;
  v_challenges integer;
  v_new_achievements text[] := array[]::text[];
begin
  if coalesce(auth.jwt()->>'role','') <> 'service_role' then
    raise exception 'not_authorized';
  end if;

  if p_user_id is null
    or p_lesson_id is null
    or p_event_type is null
    or p_verification_version is distinct from 1
    or p_lesson_id !~ '^(0|[1-9]|1[0-3])$'
    or p_event_type not in ('quiz','lesson','challenge') then
    raise exception 'invalid_event';
  end if;

  if p_event_type = 'challenge' and p_lesson_id not in ('2','6','13') then
    raise exception 'unsupported_event';
  end if;

  if p_event_type = 'lesson' and not exists (
    select 1
    from private.learning_reward_evidence e
    where e.user_id = p_user_id
      and e.lesson_id = p_lesson_id
      and e.event_type = 'quiz'
  ) then
    raise exception 'quiz_required';
  end if;

  insert into private.learning_reward_evidence(
    user_id, lesson_id, event_type, verification_version
  )
  values (p_user_id, p_lesson_id, p_event_type, p_verification_version)
  on conflict (user_id, lesson_id, event_type) do nothing
  returning id into v_evidence_id;

  if v_evidence_id is null then
    insert into public.user_stats(user_id, xp, streak, last_active_date)
    values (p_user_id, 0, 0, null)
    on conflict (user_id) do nothing;

    select * into v_stats
    from public.user_stats
    where user_id = p_user_id;

    return jsonb_build_object(
      'ok', true,
      'status', 'already_recorded',
      'lesson_id', p_lesson_id,
      'event_type', p_event_type,
      'xp_awarded', 0,
      'total_xp', coalesce(v_stats.xp, 0),
      'streak', coalesce(v_stats.streak, 0),
      'newly_unlocked_achievements', array[]::text[]
    );
  end if;

  v_xp := case p_event_type
    when 'quiz' then 15
    when 'lesson' then 20
    when 'challenge' then 30
  end;

  insert into public.xp_events(user_id, event_key, event_type, lesson_id, xp_awarded)
  values (p_user_id, p_lesson_id || ':' || p_event_type, p_event_type, p_lesson_id, v_xp)
  on conflict (user_id, event_key) do nothing
  returning id into v_xp_event_id;

  if v_xp_event_id is not null then
    insert into public.user_stats(user_id, xp, streak, last_active_date)
    values (p_user_id, v_xp, 1, v_today)
    on conflict (user_id) do update set
      xp = public.user_stats.xp + excluded.xp,
      streak = case
        when public.user_stats.last_active_date = v_today then public.user_stats.streak
        when public.user_stats.last_active_date = v_today - 1 then public.user_stats.streak + 1
        else 1
      end,
      last_active_date = v_today,
      updated_at = now();
  else
    insert into public.user_stats(user_id, xp, streak, last_active_date)
    values (p_user_id, 0, 0, null)
    on conflict (user_id) do nothing;
  end if;

  select * into v_stats
  from public.user_stats
  where user_id = p_user_id;

  select
    count(distinct e.lesson_id) filter (where e.event_type = 'lesson'),
    count(distinct e.lesson_id) filter (where e.event_type = 'quiz'),
    count(distinct e.lesson_id) filter (where e.event_type = 'challenge')
  into v_lessons, v_quizzes, v_challenges
  from private.learning_reward_evidence e
  where e.user_id = p_user_id;

  with newly_earned as (
    insert into public.user_achievements(user_id, achievement_id)
    select p_user_id, a.achievement_id
    from (values
      ('first', v_lessons >= 1),
      ('five', v_lessons >= 5),
      ('python', v_lessons >= 14),
      ('quiz', v_quizzes >= 14),
      ('challenge', v_challenges >= 1),
      ('builder', v_challenges >= 3),
      ('week', v_stats.streak >= 7),
      ('explorer', v_stats.xp >= 500)
    ) as a(achievement_id, qualifies)
    where a.qualifies
    on conflict (user_id, achievement_id) do nothing
    returning achievement_id
  )
  select coalesce(array_agg(achievement_id), array[]::text[])
  into v_new_achievements
  from newly_earned;

  return jsonb_build_object(
    'ok', true,
    'status', 'recorded',
    'lesson_id', p_lesson_id,
    'event_type', p_event_type,
    'xp_awarded', case when v_xp_event_id is null then 0 else v_xp end,
    'total_xp', coalesce(v_stats.xp, 0),
    'streak', coalesce(v_stats.streak, 0),
    'newly_unlocked_achievements', v_new_achievements
  );
end;
$function$;

revoke all on function private.record_verified_learning_event(uuid,text,text,smallint)
  from public, anon, authenticated;
grant execute on function private.record_verified_learning_event(uuid,text,text,smallint)
  to service_role;

-- Close the legacy RPC bypass. New rewards must come through the verifier.
create or replace function public.award_learning_xp(
  p_user_id uuid,
  p_event_key text,
  p_event_type text,
  p_lesson_id text
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
begin
  if coalesce(auth.jwt()->>'role','') <> 'service_role' then
    raise exception 'not_authorized';
  end if;
  raise exception 'verified_activity_required';
end;
$function$;

revoke all on function public.award_learning_xp(uuid,text,text,text)
  from public, anon, authenticated;
grant execute on function public.award_learning_xp(uuid,text,text,text)
  to service_role;
