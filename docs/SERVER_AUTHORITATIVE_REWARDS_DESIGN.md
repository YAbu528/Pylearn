# PyLearn server-authoritative rewards — design proposal

**Status:** Draft for review; not implemented  
**Date:** 2026-11-07  
**Repository:** `YAbu528/Pylearn`  
**Feature branch:** `feat/server-authoritative-rewards-20261107`  
**Base commit:** `faeb179c337d5c063a266086fc2b97b624a6215e`

## 1. Goals and non-goals

### Goals
- Make every new XP award depend on server-validated learning evidence.
- Preserve existing Supabase accounts, auth providers, XP totals, XP event history, achievement rows, notes, bookmarks, reviews, challenge-attempt history, and user-visible lesson progress.
- Keep progress and reward state synchronized across devices.
- Make retries and concurrent submissions idempotent.
- Keep service-role credentials and trusted answer keys off the browser.
- Make the transition understandable and recoverable for existing learners.

### Non-goals for the first release
- Prove that a person genuinely understood or read lesson material. A server can validate a submitted answer, not the learner's thought process.
- Run arbitrary learner Python in a privileged Edge Function.
- Award authoritative XP for code/debug tasks until a safe independent execution/validation boundary exists.
- Retroactively convert old client-writable progress flags into verified evidence.
- Recalculate or delete historical XP or achievement rows.

## 2. Current state verified

- `lesson_progress` is user-owned and client-writable, including `completed`, `quiz_best_score`, and `challenge_completed`.
- The current `award_learning_xp` RPC trusts those three flags. Its fixed reward values are quiz 15, lesson 20, challenge 30 XP.
- `xp_events` has a unique key on `(user_id,event_key)`; current keys are `<lesson_id>:<event_type>`.
- Authenticated users can read their own XP events, stats, and achievement rows, but cannot write those reward tables directly.
- `challenge_attempts` is a user-owned append-only history table; it is not trusted reward evidence.
- Frontend quiz answer indexes and challenge solution material are currently embedded in `script.js`; browser-side checks and Worker results cannot authorize rewards.
- There are 14 current lessons. Challenge modes in order are: code, code, predict, debug, code, code, mcq, code, fill, code, debug, code, code, predict.
- Existing XP and achievement data must remain intact. Historical progress flags are not reliable proof and must not be silently backfilled as verified.

## 3. Proposed architecture

### 3.1 Separate progress display from reward evidence

Keep `public.lesson_progress` as the cross-device, user-visible learning-progress record during the transition. It may continue to carry display state such as last opened, locally completed, quiz best score, and challenge completed. Those fields must no longer be consulted to authorize XP or newly earned integrity-sensitive achievements.

Create a private, server-owned evidence store, proposed as `private.learning_reward_evidence`, with:
- `id` UUID primary key
- `user_id` UUID references `auth.users(id)` with cascade delete
- `lesson_id` text
- `event_type` constrained to `quiz`, `lesson`, or `challenge`
- `verification_version` integer
- `verified_at` timestamptz
- unique `(user_id, lesson_id, event_type)`

Do not store submitted answers or learner code unless there is a specific audit need. The evidence row means only that the server accepted the corresponding validation event under a named validator version.

The private schema/table should have RLS enabled, no access for `anon` or `authenticated`, and only the necessary server-side privileges. Do not expose it through the browser Data API.

### 3.2 Server validation API

Add a JWT-protected Edge Function, proposed name `verify-learning-activity`. It must:
1. Validate the bearer token with Supabase Auth `getUser(token)`.
2. Derive `user_id` exclusively from that verified user; ignore/reject any user ID in the request body.
3. Validate the lesson identifier against the server's known lesson catalog.
4. Validate the submitted answer using server-owned answer data that is not bundled in the browser.
5. Call one service-role-only database RPC that records evidence and awards the corresponding event atomically.
6. Return a minimal structured result (accepted/already recorded, XP result, and safe feedback).

Proposed request shapes:
- Quiz: `{ "lesson_id": "0", "event_type": "quiz", "answer_index": 1 }`
- Lesson completion: `{ "lesson_id": "0", "event_type": "lesson" }`; server accepts only if verified quiz evidence exists for that user and lesson.
- Supported objective challenge: `{ "lesson_id": "6", "event_type": "challenge", "answer": "sum(numbers)" }` or a bounded answer index, depending on the challenge's type.

Do not accept `user_id`, XP amount, event key, validation result, validator index, `ok: true`, or client-selected reward amount as authoritative input.

### 3.3 Initial validation coverage

- Quizzes: all 14 quiz items can be checked server-side by answer index. Remove answer indexes and answer-revealing validator data from the browser payload where practical; deliver explanations as post-answer feedback rather than shipping answer keys as executable data.
- Objective challenges: initially support the existing MCQ and prediction challenges (lesson indexes 6, 2, and 13) with server-owned expected answers. Apply explicit type-specific normalization; do not use loose substring matching.
- Fill/debug/code challenges: no authoritative challenge XP in the first release. Keep the current browser-side checker for immediate learning feedback, but do not let its result mint trusted evidence or call a reward path. Do not run arbitrary learner Python in an Edge Function.
- The `code` badge: do not award based only on local `state.runs`. Defer it until a trustworthy execution receipt exists, or revise its meaning and UI transparently in a separate product decision.

A server-validated multiple-choice answer still does not prove understanding: a learner can guess or inspect public lesson text. The security goal is to stop direct client flag forgery and make the reward decision server-owned, not to claim anti-cheat invulnerability.

### 3.4 Atomic evidence and XP transaction

Add a new service-role-only RPC, proposed name `record_verified_learning_event`, that runs in one database transaction:
- Validates arguments and supported event types.
- Inserts the trusted evidence row using the authenticated user's ID passed by the verified Edge Function.
- For lesson completion, requires existing verified quiz evidence for the same user/lesson.
- Uses a unique evidence key to make repeated and concurrent submissions safe.
- Creates the existing `xp_events` row with server-derived key `lesson_id:event_type` and server-defined XP (quiz 15, lesson 20, supported challenge 30).
- Updates `user_stats` exactly once.
- Computes newly qualifying achievements from trusted evidence and server-owned stats, not client-writable progress flags.
- Returns the current XP/streak/achievement result.

The current `award_learning_xp` RPC must be changed so it no longer treats `lesson_progress` flags as proof. The old `award-learning-reward` Edge Function may remain temporarily for compatibility only if its RPC call can award solely against already-existing trusted evidence; it must not be able to create evidence. Alternatively, retire the old function after the frontend has fully switched. The implementation must prove that a direct call to the old endpoint with forged progress flags cannot mint new XP.

Do not make evidence insertion and XP awarding separate client-visible calls. Keep them atomic in one RPC transaction.

### 3.5 Achievement semantics

New achievement qualification should use trusted records:
- `first`, `five`, `python`: count verified lesson-completion evidence.
- `challenge`, `builder`: count verified objective-challenge evidence.
- `quiz`: count verified quiz evidence against the current curriculum requirement.
- `week`: server-maintained streak.
- `explorer`: server-maintained XP total.

Existing `user_achievements` rows are immutable history for this migration: preserve them, do not delete or revoke them, and do not grant duplicate XP. Do not backfill evidence from client-writable flags. Decide and document the user-facing transition for previously completed lessons that lack verified quiz evidence; likely ask the learner to re-submit the quiz before a *new* lesson reward can be verified, while leaving their displayed completion state untouched.

## 4. Backward compatibility and rollout

1. Add private evidence storage and new RPC/Edge Function without changing existing frontend behavior.
2. Verify the new endpoint with test accounts/fixtures and direct forged-request cases.
3. Change the existing reward RPC prerequisite to trusted evidence, after the new path is available and verified. This closes the legacy endpoint bypass.
4. Update the frontend to call the verifier for quiz and lesson events. Continue syncing visible progress independently.
5. Disable old browser-triggered challenge reward requests for unsupported challenge modes; keep challenge feedback and attempt-history sync.
6. Verify sign-in, sign-out, reload, second-device sync, notes, bookmarks, reviews, challenge history, and existing XP/achievement displays.
7. Roll out only after a documented rollback plan. Production schema/function rollout must be a separate, reviewed step.

### Existing-account compatibility
- Never reset or recreate Auth users.
- Never overwrite or recompute existing XP totals from progress flags.
- Never delete or rewrite historical `xp_events` or `user_achievements`.
- Preserve `lesson_progress` rows and their visible state.
- Do not retroactively grant missing XP from old completion flags.
- Existing XP event keys must remain compatible with dedupe. New attempts for already-awarded event keys must not award again.
- A user whose lesson is shown complete but lacks trusted quiz evidence may need to verify the quiz before receiving a not-yet-earned lesson reward. This must not erase or hide their progress.

## 5. Migration and rollback requirements

- Do not replay recovered historical migrations against production.
- Build a new forward migration only after the full schema baseline and dependencies are reviewed.
- Migration must be additive first; avoid dropping or renaming current columns during the initial release.
- Include explicit RLS, grants, function execute ACLs, and a rollback script/sequence.
- Rollback must not delete new evidence, XP events, user stats, or achievements. Prefer disabling the new endpoint or reverting frontend routing while retaining additive data.
- Validate the migration against a disposable Supabase project or isolated development branch before production.
- Confirm whether Supabase Free plan branch support and available project capacity allow a disposable environment; if not, use a safe local Supabase stack. Never test destructive migration steps against production.

## 6. Required tests

- Correct/incorrect quiz submission; answer key not present in browser JS.
- Forged `completed`, `quiz_best_score`, and `challenge_completed` writes cannot create XP.
- Lesson completion without verified quiz evidence rejected; after verified quiz accepted once.
- Objective challenge correct/incorrect; forged Worker `ok: true` cannot award.
- Unsupported code/debug/fill challenge cannot mint challenge XP.
- Old `award-learning-reward` endpoint cannot mint XP from progress flags alone.
- Direct user_id substitution ignored/rejected.
- Duplicate and concurrent submissions yield exactly one evidence row and one XP event.
- Existing event key yields no duplicate XP.
- Existing user account, XP total, event history, achievements, lesson progress remain intact through migration.
- Cross-device progress, notes, bookmarks, reviews, and challenge-attempt sync remain operational.
- Offline/retry behavior does not lose events or duplicate awards.
- Android Chrome and Samsung Internet preview regression, including sign-in/out and reload.

## 7. Open decisions before implementation

- Confirm the initial supported challenge XP policy (MCQ + prediction only is the proposed safe minimum).
- Confirm whether the code badge is deferred or its wording/meaning is changed.
- Choose and test the development database strategy before applying any migration.
- Finalize the transition UX for legacy completed lessons that need quiz re-verification for an unearned lesson reward.
- Confirm exact answer normalization and validator versioning for prediction challenges.
- Decide whether a per-user/per-lesson attempt limit is necessary to reduce automated guessing; if used, ensure it does not unfairly lock out learners or punish network retries.

## 8. Current implementation status

No part of this design is implemented. No production database or Edge Function was changed. This document is a proposal for review and the basis for implementation planning.
