-- Explicit deny policies for private reward evidence/attempt tables.
-- service_role's controlled SECURITY DEFINER functions remain the only write path.

create policy "No direct access to reward evidence"
  on private.learning_reward_evidence
  for all to anon, authenticated
  using (false)
  with check (false);

create policy "No direct access to reward attempt records"
  on private.learning_reward_attempts
  for all to anon, authenticated
  using (false)
  with check (false);
