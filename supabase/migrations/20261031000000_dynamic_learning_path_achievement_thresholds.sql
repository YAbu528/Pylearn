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
declare
  v_xp integer;
  v_inserted_id bigint;
  v_today date := (now() at time zone 'Africa/Addis_Ababa')::date;
  v_stats public.user_stats%rowtype;
  v_done integer;
  v_quizzes integer;
  v_challenges integer;
  v_total_lessons integer;
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
  select count(*) into v_total_lessons from public.lesson_progress where user_id=p_user_id;

  insert into public.user_achievements(user_id,achievement_id)
  select p_user_id, a.achievement_id
  from (values
    ('first', v_done >= 1),
    ('challenge', v_challenges >= 1),
    ('five', v_done >= 5),
    ('quiz', v_total_lessons > 0 and v_quizzes >= v_total_lessons),
    ('builder', v_challenges >= 3),
    ('week', v_stats.streak >= 7),
    ('python', v_total_lessons > 0 and v_done >= v_total_lessons),
    ('explorer', v_stats.xp >= 500)
  ) as a(achievement_id, qualifies)
  where a.qualifies
  on conflict do nothing;

  select coalesce(array_agg(achievement_id),array[]::text[]) into v_earned
  from public.user_achievements
  where user_id=p_user_id;

  return jsonb_build_object(
    'awarded',true,'xp_awarded',v_xp,'xp',v_stats.xp,
    'streak',v_stats.streak,'achievements',v_earned
  );
end;
$function$;