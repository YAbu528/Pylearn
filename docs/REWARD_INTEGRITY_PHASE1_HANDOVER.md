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
