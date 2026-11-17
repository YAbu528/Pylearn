-- Require a verified passing quiz before objective challenge XP.
-- Additive Dev validation migration; production rollout remains separately gated.

CREATE OR REPLACE FUNCTION private.record_verified_learning_event(p_user_id uuid, p_lesson_id text, p_event_type text, p_verification_version smallint)
 RETURNS jsonb
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
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

  if p_event_type = 'challenge' then
    if p_lesson_id not in ('2','6','13') then
      raise exception 'unsupported_event';
    end if;

    if not exists (
      select 1
      from private.learning_reward_evidence e
      where e.user_id = p_user_id
        and e.lesson_id = p_lesson_id
        and e.event_type = 'quiz'
    ) then
      raise exception 'quiz_required';
    end if;
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
$function$
;

revoke all on function private.record_verified_learning_event(uuid,text,text,smallint) from public, anon, authenticated;
grant execute on function private.record_verified_learning_event(uuid,text,text,smallint) to service_role;
