# PyLearn Reward Integrity — Phase 1 Technical Handover

**Audit date:** 2026-11-07  
**Repository:** `YAbu528/Pylearn`  
**Base:** `main` (at the time this branch was created)  
**Purpose:** Preserve verified findings and the safe implementation plan so a future ChatGPT conversation can continue without repeating the inspection.

## Current status

- This is an inspection and design checkpoint only.
- No production database changes were made.
- No Edge Functions were redeployed.
- No user XP, progress, or achievement records were changed.
- No exploit or live account-manipulation test was performed.
- Do not describe the reward weakness as fixed.

## Confirmed findings

### 1. Progress flags are writable by authenticated clients

Live Supabase project: `vzgbxoxscmlmacxciwze`.

RLS policies on `public.lesson_progress` restrict rows to `auth.uid() = user_id`, which prevents one user from writing another user's rows. However, authenticated users have INSERT and UPDATE privileges on all inspected columns, including:

- `completed`
- `quiz_best_score`
- `challenge_completed`

The live policy set includes:
- Users can create their own lesson progress (INSERT, check user_id).
- Users can update their own lesson progress (UPDATE, using/check user_id).
- Users can read their own lesson progress.
- Users can delete their own lesson progress.

SQL privilege inspection confirmed `authenticated` can INSERT and UPDATE every column in `lesson_progress`. This is an integrity weakness, not a cross-user data exposure finding.

### 2. XP award path trusts those client-writable flags

Deployed Edge Function: `award-learning-reward` (ACTIVE, version 3, `verify_jwt=true`).

The function:
1. Extracts the Bearer token.
2. Calls Supabase Auth `getUser(token)`.
3. Reads `lesson_id` and `event_type` from the request.
4. Calls the service-role-only RPC `award_learning_xp`.

The Edge Function verifies the identity of the caller, but it does not verify the actual quiz answer or challenge solution.

Live SQL definition of `public.award_learning_xp(uuid,text,text,text)`:
- Is `SECURITY DEFINER`.
- Sets an empty search_path.
- Explicitly checks that the JWT role is `service_role`.
- Accepts only event types `quiz`, `lesson`, and `challenge`.
- Checks that a matching `lesson_progress` row has:
  - `quiz_best_score >= 100` for quiz XP,
  - `completed = true` for lesson XP,
  - `challenge_completed = true` for challenge XP.
- Awards fixed amounts: quiz 15 XP, lesson 20 XP, challenge 30 XP.
- Uses `xp_events` with conflict handling on `(user_id,event_key)` to prevent duplicate awards for the same key.
- Updates `user_stats` and achievements.

Execution privileges were checked: `service_role` can execute the RPC; `anon` and `authenticated` cannot. This is a good control and should be preserved.

**Core issue:** the RPC's prerequisite evidence is stored in a table the authenticated user can directly modify. The service-role-only RPC and event deduplication do not make the evidence trustworthy.

### 3. Quiz answer validation currently happens in browser JavaScript

Current main-branch `script.js`:
- `answerQuiz(choice)` compares the submitted choice against `lessons[current].quiz.answer` in the browser.
- On a correct answer, it updates local state and queues cloud synchronization.
- Lesson completion is allowed by the browser after `quizAnswered` is true.

The browser is not a trusted authority. A modified client can bypass or fake these checks.

### 4. Challenge validation currently happens in a browser Web Worker

Current main-branch `python-worker.js`:
- Contains a local `validators` array for the 14 lessons.
- Executes submitted Python using the browser's Pyodide runtime.
- Returns `check-result` to the main page.
- The main page's `handleChallengeResult(result)` trusts `result.ok` and records challenge completion in local state.

The worker and its message protocol are controlled by the browser user. The server does not independently reproduce or verify the result. This means a browser user can forge the success path without genuinely solving the challenge.

The worker also has a fallback validator of `valid = True` when an invalid validator index is supplied. This should be reviewed when the client-side checker is retained for learning feedback; it must never become a server-side authorization mechanism.

### 5. Sync writes progress before requesting rewards

Current main-branch `script.js`, function `syncLearningData()`:
- Reads the user's `lesson_progress`.
- Merges remote progress with local state.
- Upserts lesson progress fields, including completion, quiz score, and challenge completion.
- Iterates reward events and calls `award-learning-reward`.
- The browser stores local reward-request markers for retry behavior.

This order explains how the server later sees the progress flags, but it does not make them authoritative.

### 6. Python-run achievement is a related integrity issue

Deployed Edge Function `award-python-run` (ACTIVE, version 1, `verify_jwt=true`) verifies the user's JWT, then upserts achievement `code` into `user_achievements`.

The frontend requests it when local `state.runs >= 1`. The Edge Function does not independently verify that Python actually ran. This does not award XP, but it is a similar trust-boundary issue and should be included in the integrity work or tracked as a closely related follow-up.

## Existing protections to preserve

- Row-level security isolates users' own records.
- The reward RPC is not executable by `anon` or `authenticated`.
- The Edge Function validates the bearer token with Supabase Auth.
- Reward XP values are server-defined, not supplied by the client.
- `xp_events` deduplicates a given `user_id,event_key`.
- Existing XP and achievement data must be preserved during migration.
- The app syncs progress, notes, bookmarks, reviews, and challenge-attempt history; do not break unrelated sync behavior.

## Recommended architecture

Do not simply remove all progress writes without replacing the sync flow. That could break cross-device progress and lose existing functionality.

Implement server-authoritative learning events in stages:

1. **Quiz:** send a lesson identifier and selected answer index to a server endpoint. The server owns the answer key and validates it. Only a successful server validation can create a verified quiz event and award quiz XP.
2. **Lesson completion:** require a previously verified quiz event for the same user and lesson. The server can then authorize lesson completion and lesson XP. Be explicit that this proves the quiz prerequisite, not that the server can prove the learner read every paragraph.
3. **Challenges:** multiple-choice and prediction challenges can be validated server-side from server-owned expected answers. Code-writing challenges require a trustworthy execution/validation boundary. Do not trust a client-provided `ok: true`, browser Worker message, client-supplied validator index, or client-written `challenge_completed` flag.
4. **Code challenges:** before awarding XP for arbitrary Python solutions, choose a safe execution design with strict isolation, CPU/memory/time limits, no secrets, no unrestricted network or filesystem access, abuse controls, and cost limits. Do not casually execute user Python in a privileged Edge Function. Until a secure validator exists, either keep code-challenge feedback client-side but do not award authoritative XP for it, or design another clearly disclosed interim policy.
5. **Progress storage:** separate user-visible progress state from verified reward evidence. Consider making reward-critical columns server-managed while preserving user-owned read access and other legitimate progress features. Define a migration and compatibility plan before changing grants or RLS.
6. **Idempotency:** retain and test duplicate/replay protection, including concurrent requests. Event keys should be server-derived and scoped to the correct user/activity.
7. **Python-run badge:** require a server-verifiable execution receipt or change the badge semantics so it does not claim verified execution.

## Required inspection before implementation

- Read the entire current `script.js` sync and auth flow, not just the snippets above.
- Read the complete current `python-worker.js` and lesson challenge definitions.
- Inspect exact schemas, constraints, indexes, triggers, grants, and policies for `lesson_progress`, `xp_events`, `user_stats`, `user_achievements`, and `challenge_attempts`.
- Inspect all deployed Edge Function source and tracked GitHub source, including the open source-reconciliation PR #38.
- Check whether PR #38 is merged before building on or duplicating its files. At this audit point it was OPEN, with a successful Vercel deployment status on its head commit.
- Inspect any existing branch named `server-managed-rewards` before reusing it. A branch with that name exists, but its reward function file lookup returned 404; do not assume it is a complete or current implementation.

## Test matrix required before calling the issue fixed

| Test | Expected result |
|---|---|
| Correct quiz answer submitted through normal UI | Server verifies once; correct XP awarded once |
| Incorrect quiz answer | No verified event; no XP |
| Forged quiz completion flag written directly by authenticated client | Cannot create verified quiz event or XP |
| Lesson completion without verified quiz | Rejected |
| Lesson completion after verified quiz | Allowed once; correct XP |
| Duplicate reward request | No additional XP |
| Concurrent duplicate requests | Exactly one award |
| Another user's user_id supplied in payload | Rejected/ignored; identity always derived from JWT |
| Forged challenge success from browser | No challenge XP |
| Correct MCQ/prediction challenge | Server validates and awards once |
| Code challenge with manipulated Worker response | No authoritative XP |
| Existing users' XP and achievements | Preserved |
| Sign out/in and second-device sync | Progress and authoritative XP remain consistent |
| Network failure/retry | No lost event and no duplicate award |

## Branch and checkpoint

This handover is stored on branch:

`audit/reward-integrity-phase1-20261107`

This branch is a documentation checkpoint, not a production fix. It should be used as the recovery point for the next implementation conversation.

## Next action

Design the event schema and API contract for server-verified quiz completion and lesson completion, while explicitly separating code-challenge validation as a distinct security problem. Then implement on a feature branch and test in preview. Do not modify production Supabase policies, grants, tables, or functions until the migration and rollback plan are reviewed.

---

## Phase 2 milestone — server-authoritative reward system

**Milestone objective (confirmed 2026-11-07):**

Build a server-authoritative reward system that preserves all existing accounts, existing XP and achievement records, and reliable cross-device learning progress.

This is the next project milestone. The Phase 1 findings above remain the verified baseline; they must not be described as fixed until implementation and the required tests have passed.

### Scope and invariants

- Preserve existing Supabase users/accounts and authentication providers.
- Preserve existing XP totals, XP event history, achievements, notes, bookmarks, challenge-attempt history, and legitimate learning progress.
- Preserve sign-in/sign-out behavior and cross-device synchronization.
- Derive the acting user identity from the validated JWT on the server; never trust a client-supplied user ID for reward ownership.
- Make reward-critical evidence server-authoritative. Client-side state may support responsive learning UI, but must not authorize XP.
- Keep reward amounts and event identity server-defined.
- Preserve idempotency under retries, duplicate requests, and concurrent requests.
- Do not make production database, RLS, grant, or Edge Function changes until the schema/API design, migration, compatibility, and rollback plans have been reviewed.
- Keep arbitrary Python execution and code-challenge validation as a separately designed security boundary. Do not treat a browser Worker result as proof.

### Agreed implementation order

1. Reinspect current repository and deployed state before coding, including PR #38 and any existing server-managed-rewards branch. Confirm current status rather than relying on the Phase 1 snapshot.
2. Inspect complete frontend auth/sync flow, lesson and challenge definitions, current Edge Function source, and relevant database schemas, constraints, indexes, triggers, grants, and RLS policies.
3. Design the server-verified event schema and API contract for quiz validation and lesson completion.
4. Design a backward-compatible migration that separates user-visible progress from trusted reward evidence and preserves existing user data.
5. Implement on a dedicated feature branch; do not deploy schema or function changes to production during initial development.
6. Validate in preview using the full Phase 1 test matrix, plus migration/rollback, existing-account compatibility, and cross-device regression tests.
7. Inspect actual results and deployed preview before reporting a fix as complete. Production rollout requires an explicit review of migration safety and rollback readiness.

### Continuity and GitHub handover protocol — mandatory

This document is the durable technical handover for this work. Keep it updated throughout the milestone so a fresh conversation can recover the project without depending on chat history.

For every meaningful work session or milestone:
- Update this document on the recovery branch (or a clearly identified successor branch) with the objective, inspected files/systems, verified findings, decisions and rationale, implementation details, exact branch/commit/PR references, tests actually run and their results, and remaining risks/open questions.
- Record what was changed and what was deliberately not changed. Distinguish inspected, proposed, implemented, preview-tested, and production-deployed states.
- Record exact file paths, database objects, function names, migration identifiers, and relevant commit SHAs where available.
- Never record a test as passed unless it was actually run and its result inspected. Never claim a fix is complete based only on code changes.
- Before ending a substantial session or when the conversation is getting long, commit the latest handover update and fetch it again from GitHub to verify that the document exists and contains the new checkpoint.
- At the end of each session, leave a concise Next session entry point stating the exact next action and any required context.
- A new conversation should first fetch this document from GitHub and read the latest checkpoint before asking the user to repeat project details or making changes.

### Session checkpoint — 2026-11-07

- The Phase 1 handover was fetched successfully from audit/reward-integrity-phase1-20261107.
- The user confirmed the next milestone objective: a server-authoritative reward system that preserves existing accounts and cross-device progress.
- No Phase 2 implementation or production changes have been made in this session.
- The user explicitly requires this GitHub handover method to be followed continuously for future work.

### Next session entry point

Begin with the required current-state reinspection: check PR #38, inspect the existing server-managed-rewards branch, and reconcile deployed Edge Function source with tracked GitHub source. Then inspect the complete auth/sync and relevant database definitions before finalizing the event schema and API contract. Do not begin production changes.


## Phase 2 current-state reinspection — 2026-11-07

This checkpoint records a read-only reinspection performed after the user confirmed the Phase 2 milestone. No implementation or production mutation was performed.

### GitHub state and source reconciliation

- PR #38, **"Reconcile Supabase backend sources and Pyodide documentation"**, is still **OPEN**, not merged. Its head branch is `chore/backend-source-reconciliation-20261107`, head commit `75526fbc7fad72cad868945e87206a9dbbe9e6ea`, base is `main`.
- PR #38 changes five files. It restores `supabase/functions/award-learning-reward/index.ts`, records `award-python-run`, and adds `supabase/BACKEND_SOURCE_RECONCILIATION.md`. The deployed `award-learning-reward` version 3 source retrieved from Supabase matches the restored source content in the PR.
- Main currently has only `supabase/functions/award-python-run/index.ts`; it does **not** contain the `award-learning-reward` source. Main has migration `20261031000000_dynamic_learning_path_achievement_thresholds.sql`, while live Supabase records the applied migration as `20261031181048_dynamic_learning_path_achievement_thresholds`.
- PR #38 contains the corrected-version replayable function migration `20261031181048_dynamic_learning_path_achievement_thresholds.sql`, explicitly documented as reconstructed from live function state, not the original historical SQL body. Do not replay this against production.
- Existing branch `server-managed-rewards` exists at commit `aee06ba566116cd3d201a7f1eb110d93b1204bef` (2026-10-25, commit message "Keep other cloud sync working when reward requests fail"). Its recursive tree contains only the older static-site files and no `supabase/` directory or reward implementation. It is stale and is not a suitable base for Phase 2.
- The recovery branch remains `audit/reward-integrity-phase1-20261107`, last known checkpoint before this update: `00f3896411d16847eaf9e56bc05d43686a9fb65c`.

### Live Supabase state rechecked

Project: `vzgbxoxscmlmacxciwze`.

- Edge Functions:
  - `award-learning-reward`: ACTIVE version 3, `verify_jwt=true`.
  - `award-python-run`: ACTIVE version 1, `verify_jwt=true`.
- Live table inspection reports 9 profiles/user-stat rows, 126 lesson-progress rows, 87 XP-event rows, 21 achievement rows, and 18 challenge-attempt rows at inspection time. These are aggregate counts only; no row contents were modified.
- Seven migrations are recorded as applied: `20261024171501`, `20261024181332`, `20261024181913`, `20261024182004`, `20261025120628`, `20261027163024`, and `20261031181048`.
- Live RLS policies confirm that authenticated users may INSERT and UPDATE their own `lesson_progress` rows. They may only SELECT their own `xp_events`, `user_stats`, and `user_achievements`; the service role owns the write path for those reward tables.
- `challenge_attempts` permits authenticated INSERT and SELECT for the user's own rows, but not UPDATE. It is an append-only user activity/history record, not verified reward evidence.
- Live function `public.award_learning_xp(uuid,text,text,text)` remains SECURITY DEFINER with empty search_path and explicit service_role JWT check. Its execute ACL includes postgres and service_role; authenticated/anon are not granted EXECUTE.
- The live RPC still trusts `lesson_progress.quiz_best_score`, `completed`, and `challenge_completed`. It awards 15/20/30 XP and deduplicates via `xp_events(user_id,event_key)`. The RPC's service-role gate and event dedupe remain protections to retain.

### Frontend inspection — main branch

Inspected `script.js` (blob SHA `a2144b358d104c395c5dd800db76d12ba641af14`) and `python-worker.js` (blob SHA `77da2d933177045028def3e1837a1c6ee6cf384c`).

- There are 14 lesson definitions with 14 browser-side quiz answer keys.
- Challenge modes by lesson index are: code, code, predict, debug, code, code, mcq, code, fill, code, debug, code, code, predict.
- Quiz validation is in `answerQuiz(choice)`, comparing the browser-submitted choice to `lessons[current].quiz.answer`.
- `completeLesson()` depends on the browser's `quizAnswered` state.
- `checkChallenge()` validates MCQ and prediction answers in the browser. Other challenge modes use the Pyodide Web Worker. `handleChallengeResult(result)` trusts `result.ok` from the browser/worker and marks the challenge complete.
- `python-worker.js` contains 14 local validators; invalid validator indices fall back to `valid = True`. This is suitable only as a UI feedback bug to address; it cannot be a trusted reward gate.
- `syncLearningData()` currently merges local and remote progress, upserts all 14 rows with user-visible `completed`, `quiz_best_score`, and `challenge_completed` values, then invokes `award-learning-reward` for locally merged state. This is the direct compatibility hotspot: a secure change must preserve cross-device progress while stopping client flags from being reward evidence.
- The same sync routine keeps separate flows for notes, bookmarks, lesson reviews, and challenge-attempt history. Those unrelated sync flows must remain operational.
- `award-python-run` is invoked when local `state.runs >= 1`; the deployed function only writes the `code` achievement and does not independently verify execution.

### Design implications from this reinspection

1. PR #38 should be reviewed/merged as source-control recovery separately from Phase 2 security changes. Do not duplicate its recovered Edge Function source or migration.
2. Do not reuse `server-managed-rewards`; create a new Phase 2 feature branch from an up-to-date main after PR #38 is reconciled.
3. Keep user-visible lesson progress sync distinct from trusted reward evidence. Do not simply remove progress writes; the current sync merge/upsert is also how existing accounts and devices retain learning progress.
4. New reward evidence should be written only by server validation after deriving the user from the verified JWT. A new trusted evidence record/table or equivalent server-owned structure is preferable to reusing client-writable `lesson_progress` flags.
5. A verified quiz event can be the prerequisite for lesson-completion XP. It does not prove the learner read lesson text; document that product meaning accurately.
6. Predict and MCQ challenges can be validated using server-owned expected answers. Fill/debug/code tasks need per-type server-side validation. Do not award code-task XP from browser Worker output; arbitrary Python needs a separately secured execution service or a clearly separated no-XP interim treatment.
7. Preserve existing `xp_events`, `user_stats`, and `user_achievements` rows. Historical client-writable completion flags must not be silently treated as newly verified evidence or retroactively rewarded. Existing event keys and totals need compatibility checks before rollout.
8. The `code` achievement needs its own trustworthy semantics/receipt; the current `state.runs` gate is not proof of Python execution.

### What was and was not done in this checkpoint

**Inspected:** PR #38 metadata and changed files; current main and legacy branch trees; live Edge Function versions and source; live migration ledger; relevant table schemas, RLS policies, table grants, and the live reward RPC definition; frontend quiz/challenge/sync call sites and the full Worker source.

**Not done:** no source edits, no feature branch creation, no SQL migration, no RLS/grant change, no Edge Function deployment, no user-data write, no account mutation, no exploit test, and no mobile preview regression test.

### Next session entry point

1. Review and merge PR #38 as the separate source-control recovery step (do not merge automatically without inspecting its checks/diff and ensuring the user authorizes the merge).
2. Once the recovered sources are on main, create a fresh Phase 2 feature branch from that current main.
3. Finish the DB object inventory (all indexes, unique constraints, triggers, and exact grants), inspect the full frontend auth/sync sections and challenge definitions as needed, then write the trusted-event schema/API and compatibility/rollback design.
4. Do not modify production until the design and migration plan are reviewed.