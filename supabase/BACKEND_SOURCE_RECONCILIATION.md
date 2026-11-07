# Backend source-control reconciliation (2026-11-07)

## Verified live project

- Supabase project: `vzgbxoxscmlmacxciwze`
- Applied migration history currently reports seven versions:
  - `20261024171501_pylearn_initial_schema`
  - `20261024181332_cloud_progress_sync_foundation`
  - `20261024181913_unique_user_learning_records`
  - `20261024182004_remove_duplicate_sync_indexes`
  - `20261025120628_secure_learning_rewards`
  - `20261027163024_learning_reviews_and_challenge_attempt_history`
  - `20261031181048_dynamic_learning_path_achievement_thresholds`

## Edge Functions

Both active deployed Edge Functions now have tracked source:
- `supabase/functions/award-learning-reward/index.ts`
- `supabase/functions/award-python-run/index.ts`

The reward function source was recovered from deployed version 3 and checked against the live function definition. The Python-run achievement function source is already tracked in the repository and was checked against deployed version 1.

## Migration history gap — not silently fabricated

The repository previously contained only two migration files, while the live project reports seven applied migrations. The two tracked files do not fully reproduce the applied history, and the previous reward migration filename/version did not match the database's recorded version. This branch adds a replayable replacement for the current live reward-function definition under the database's recorded version. It is not claimed to be the original historical SQL body.

The original SQL bodies for these five applied migrations were not present in the repository and cannot be recovered from the migration-version ledger alone:
- `20261024171501_pylearn_initial_schema`
- `20261024181332_cloud_progress_sync_foundation`
- `20261024181913_unique_user_learning_records`
- `20261024182004_remove_duplicate_sync_indexes`
- `20261025120628_secure_learning_rewards`

Do not invent replacement historical migrations or mark them as unapplied. Before using migration reset/replay or onboarding a second environment, create and review a complete schema baseline from the live database (tables, constraints, indexes, RLS policies, triggers, functions, and grants), then validate it against a clean disposable Supabase project. The live project is the current operational source of truth until that baseline is validated.

## Important live-state finding

The current deployed `award_learning_xp` function uses a fixed lesson threshold of 14 (`v_total_lessons := 14`). The earlier tracked file was named as a dynamic-threshold migration and contained different SQL. The corrected migration in this branch records the current live function definition; it does not claim that the live threshold is dynamic.

## Safe deployment rule

- Do not apply these recovered files to the existing production database as a replay.
- Review and merge source-control recovery separately from any database change.
- Test migration replay only against a disposable database first.
