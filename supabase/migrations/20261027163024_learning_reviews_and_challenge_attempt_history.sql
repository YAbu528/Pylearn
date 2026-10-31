create table if not exists public.lesson_reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  lesson_id text not null,
  rating smallint not null check (rating between 1 and 4),
  interval_days smallint not null check (interval_days between 1 and 60),
  reviewed_at timestamptz not null default now(),
  next_review_at timestamptz not null,
  created_at timestamptz not null default now()
);

create index if not exists lesson_reviews_user_reviewed_idx
  on public.lesson_reviews (user_id, reviewed_at desc);
create index if not exists lesson_reviews_user_next_idx
  on public.lesson_reviews (user_id, next_review_at);

alter table public.lesson_reviews enable row level security;
revoke all on public.lesson_reviews from anon, authenticated;
grant select, insert on public.lesson_reviews to authenticated;

create policy "Users can read their own lesson reviews"
  on public.lesson_reviews for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can add their own lesson reviews"
  on public.lesson_reviews for insert to authenticated
  with check ((select auth.uid()) = user_id);

create table if not exists public.challenge_attempts (
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

create index if not exists challenge_attempts_user_time_idx
  on public.challenge_attempts (user_id, attempted_at desc);
create index if not exists challenge_attempts_user_lesson_time_idx
  on public.challenge_attempts (user_id, lesson_id, attempted_at desc);
create index if not exists challenge_attempts_user_outcome_idx
  on public.challenge_attempts (user_id, outcome, attempted_at desc);

alter table public.challenge_attempts enable row level security;
revoke all on public.challenge_attempts from anon, authenticated;
grant select, insert on public.challenge_attempts to authenticated;

create policy "Users can read their own challenge attempts"
  on public.challenge_attempts for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Users can add their own challenge attempts"
  on public.challenge_attempts for insert to authenticated
  with check ((select auth.uid()) = user_id);
