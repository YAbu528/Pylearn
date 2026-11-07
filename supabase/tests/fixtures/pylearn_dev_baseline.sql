-- DEV-ONLY BASELINE FIXTURE.
-- Recreates the reward-related public schema shape from production using no user data.
-- Apply only to the isolated Pylearn-Dev project. Never run against production.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.user_stats (
  user_id uuid primary key references auth.users(id) on delete cascade,
  xp integer not null default 0 check (xp >= 0),
  streak integer not null default 0 check (streak >= 0),
  last_active_date date,
  updated_at timestamptz not null default now()
);

create table public.lesson_progress (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  completed boolean not null default false,
  quiz_best_score smallint check (quiz_best_score between 0 and 100),
  challenge_completed boolean not null default false,
  last_opened_at timestamptz,
  updated_at timestamptz not null default now(),
  constraint lesson_progress_user_id_lesson_id_key unique(user_id, lesson_id)
);
create index lesson_progress_user_id_idx on public.lesson_progress(user_id);

create table public.user_notes (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint user_notes_user_id_lesson_id_key unique(user_id, lesson_id)
);
create index user_notes_user_id_idx on public.user_notes(user_id);

create table public.user_bookmarks (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  created_at timestamptz not null default now(),
  deleted_at timestamptz,
  constraint user_bookmarks_user_id_lesson_id_key unique(user_id, lesson_id)
);
create index user_bookmarks_user_id_idx on public.user_bookmarks(user_id);

create table public.user_achievements (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  achievement_id text not null,
  earned_at timestamptz not null default now(),
  constraint user_achievements_user_id_achievement_id_key unique(user_id, achievement_id)
);
create index user_achievements_user_id_idx on public.user_achievements(user_id);

create table public.xp_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  event_key text not null,
  event_type text not null check (event_type in ('quiz','lesson','challenge')),
  lesson_id text not null,
  xp_awarded integer not null check (xp_awarded > 0),
  created_at timestamptz not null default now(),
  constraint xp_events_user_id_event_key_key unique(user_id, event_key)
);

create table public.lesson_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  rating smallint not null check (rating between 1 and 4),
  interval_days smallint not null check (interval_days between 1 and 60),
  reviewed_at timestamptz not null default now(),
  next_review_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index lesson_reviews_user_reviewed_idx on public.lesson_reviews(user_id, reviewed_at desc);
create index lesson_reviews_user_next_idx on public.lesson_reviews(user_id, next_review_at);

create table public.challenge_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  challenge_id text not null,
  challenge_type text not null check (challenge_type in ('code','predict','fill','debug','mcq')),
  outcome text not null check (outcome in ('correct','incorrect','error')),
  passed_tests smallint check (passed_tests is null or passed_tests >= 0),
  total_tests smallint check (total_tests is null or total_tests >= 0),
  attempted_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  constraint challenge_attempts_test_counts_valid
    check (passed_tests is null or total_tests is null or passed_tests <= total_tests)
);
create index challenge_attempts_user_time_idx on public.challenge_attempts(user_id, attempted_at desc);
create index challenge_attempts_user_lesson_time_idx on public.challenge_attempts(user_id, lesson_id, attempted_at desc);
create index challenge_attempts_user_outcome_idx on public.challenge_attempts(user_id, outcome, attempted_at desc);

alter table public.profiles enable row level security;
alter table public.user_stats enable row level security;
alter table public.lesson_progress enable row level security;
alter table public.user_notes enable row level security;
alter table public.user_bookmarks enable row level security;
alter table public.user_achievements enable row level security;
alter table public.xp_events enable row level security;
alter table public.lesson_reviews enable row level security;
alter table public.challenge_attempts enable row level security;

revoke all on public.profiles, public.user_stats, public.lesson_progress,
  public.user_notes, public.user_bookmarks, public.user_achievements,
  public.xp_events, public.lesson_reviews, public.challenge_attempts
from anon, authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select on public.user_stats, public.user_achievements, public.xp_events to authenticated;
grant select, insert, update, delete on public.lesson_progress, public.user_notes, public.user_bookmarks to authenticated;
grant select, insert on public.lesson_reviews, public.challenge_attempts to authenticated;

create policy "Users can create their own profile" on public.profiles
  for insert to authenticated with check ((select auth.uid()) = id);
create policy "Users can read their own profile" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "Users can update their own profile" on public.profiles
  for update to authenticated using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

create policy "Users can read their own stats" on public.user_stats
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can create their own lesson progress" on public.lesson_progress
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can read their own lesson progress" on public.lesson_progress
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can update their own lesson progress" on public.lesson_progress
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own lesson progress" on public.lesson_progress
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can create their own notes" on public.user_notes
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can read their own notes" on public.user_notes
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can update their own notes" on public.user_notes
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own notes" on public.user_notes
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can create their own bookmarks" on public.user_bookmarks
  for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "Users can read their own bookmarks" on public.user_bookmarks
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can update their own bookmarks" on public.user_bookmarks
  for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Users can delete their own bookmarks" on public.user_bookmarks
  for delete to authenticated using ((select auth.uid()) = user_id);

create policy "Users can read their own achievements" on public.user_achievements
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can read their own XP events" on public.xp_events
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can read their own lesson reviews" on public.lesson_reviews
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can add their own lesson reviews" on public.lesson_reviews
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can read their own challenge attempts" on public.challenge_attempts
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "Users can add their own challenge attempts" on public.challenge_attempts
  for insert to authenticated with check ((select auth.uid()) = user_id);

-- Mirror the currently deployed reward RPC so the development migration can prove
-- that forged progress flags stop working after hardening.
create or replace function public.award_learning_xp(
  p_user_id uuid, p_event_key text, p_event_type text, p_lesson_id text
)
returns jsonb
language plpgsql
security definer
set search_path to ''
as $function$
declare
  v_xp integer;
  v_inserted_id bigint;
  v_today date := (now() at time zone 'Africa/Addis_Ababa')::date;
  v_stats public.user_stats%rowtype;
  v_done integer;
  v_quizzes integer;
  v_challenges integer;
  v_total_lessons integer := 14;
  v_earned text[] := array[]::text[];
begin
  if coalesce(auth.jwt()->>'role','') <> 'service_role' then
    raise exception 'Not authorized';
  end if;
  if p_user_id is null or p_event_type not in ('quiz','lesson','challenge') then
    raise exception 'Invalid reward event';
  end if;
  if p_lesson_id !~ '^(0|[1-9][0-9]*)$' or p_event_key <> p_lesson_id || ':' || p_event_type then
    raise exception 'Invalid reward event key';
  end if;
  v_xp := case p_event_type when 'quiz' then 15 when 'lesson' then 20 when 'challenge' then 30 end;
  if not exists (
    select 1 from public.lesson_progress lp
    where lp.user_id = p_user_id and lp.lesson_id = p_lesson_id
      and ((p_event_type = 'quiz' and lp.quiz_best_score >= 100)
        or (p_event_type = 'lesson' and lp.completed)
        or (p_event_type = 'challenge' and lp.challenge_completed))
  ) then
    raise exception 'The required learning activity is not recorded';
  end if;
  insert into public.xp_events(user_id,event_key,event_type,lesson_id,xp_awarded)
  values(p_user_id,p_event_key,p_event_type,p_lesson_id,v_xp)
  on conflict (user_id,event_key) do nothing
  returning id into v_inserted_id;
  if v_inserted_id is null then
    select * into v_stats from public.user_stats where user_id=p_user_id;
    return jsonb_build_object('awarded',false,'xp',coalesce(v_stats.xp,0),'streak',coalesce(v_stats.streak,0),'reason','already_awarded');
  end if;
  insert into public.user_stats(user_id,xp,streak,last_active_date)
  values(p_user_id,v_xp,1,v_today)
  on conflict(user_id) do update set
    xp = public.user_stats.xp + excluded.xp,
    streak = case
      when public.user_stats.last_active_date = v_today then public.user_stats.streak
      when public.user_stats.last_active_date = v_today - 1 then public.user_stats.streak + 1
      else 1
    end,
    last_active_date = v_today,
    updated_at = now();
  select * into v_stats from public.user_stats where user_id=p_user_id;
  select count(*) into v_done from public.lesson_progress where user_id=p_user_id and completed;
  select count(*) into v_quizzes from public.lesson_progress where user_id=p_user_id and quiz_best_score >= 100;
  select count(*) into v_challenges from public.lesson_progress where user_id=p_user_id and challenge_completed;
  insert into public.user_achievements(user_id,achievement_id)
  select p_user_id, a.achievement_id
  from (values
    ('first', v_done >= 1), ('challenge', v_challenges >= 1),
    ('five', v_done >= 5), ('quiz', v_quizzes >= v_total_lessons),
    ('builder', v_challenges >= 3), ('week', v_stats.streak >= 7),
    ('python', v_done >= v_total_lessons), ('explorer', v_stats.xp >= 500)
  ) as a(achievement_id, qualifies)
  where a.qualifies on conflict do nothing;
  select coalesce(array_agg(achievement_id),array[]::text[]) into v_earned
  from public.user_achievements where user_id=p_user_id;
  return jsonb_build_object('awarded',true,'xp_awarded',v_xp,'xp',v_stats.xp,'streak',v_stats.streak,'achievements',v_earned);
end;
$function$;

revoke all on function public.award_learning_xp(uuid,text,text,text) from public, anon, authenticated;
grant execute on function public.award_learning_xp(uuid,text,text,text) to service_role;
