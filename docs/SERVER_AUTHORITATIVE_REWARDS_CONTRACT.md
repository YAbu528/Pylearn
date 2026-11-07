# PyLearn verified learning event contract

**Status:** Implemented in isolated Pylearn-Dev for the database/API boundary; frontend integrated on the preview branch. Authenticated browser end-to-end testing and production rollout remain pending.  
**Date:** 2026-11-07  
**Feature branch:** `feat/server-authoritative-rewards-20261107`

This contract is the detailed companion to `docs/SERVER_AUTHORITATIVE_REWARDS_DESIGN.md` and the recovery handover `docs/PYLEARN_WEAKNESSES_UPDATED.md`.

## Lesson quiz answer-key inventory

The following indexes are zero-based, matching the current `script.js` answer indexes. Move the expected values to server-owned code/configuration and remove them from the browser bundle before enabling server-authoritative quiz XP.

| Lesson ID | Lesson | Expected answer index |
|---:|---|---:|
| 0 | Python Basics: variables & print() | 1 |
| 1 | Data Types: strings, integers & floats | 2 |
| 2 | Operators & input() | 0 |
| 3 | Conditions: if, elif & else | 1 |
| 4 | Loops: for & while | 0 |
| 5 | Functions: reusable code | 1 |
| 6 | Lists & dictionaries | 1 |
| 7 | Errors & modules | 1 |
| 8 | String Skills | 0 |
| 9 | Tuples & sets | 1 |
| 10 | Comprehensions | 0 |
| 11 | File handling | 1 |
| 12 | Object-oriented Python | 0 |
| 13 | APIs & JSON | 0 |

The explanation text may be returned after validation; the answer index must not be included in client-delivered lesson data. Server validation proves only that the submitted choice matches the key, not that the learner understood the lesson.

## Objective challenge inventory

| Lesson ID | Mode | Expected answer | Normalization |
|---:|---|---|---|
| 2 | predict | `16` | Trim outer whitespace, then case-insensitive exact equality. |
| 6 | mcq | index `1` (`sum(numbers)`) | Exact integer equality. |
| 13 | predict | `95` | Trim outer whitespace, then case-insensitive exact equality. |

Initial challenge XP scope: only these objective challenges. Code/debug/fill challenge results remain local feedback and cannot create trusted reward evidence or award XP. Do not use substring matching. Assign a validator version and test all accepted/rejected forms.

## Request and response

Function: `verify-learning-activity` with JWT verification enabled. Authenticate with Auth `getUser(token)`; use that user's ID only.

- Quiz request: `{ "lesson_id": "0", "event_type": "quiz", "answer_index": 1 }`
- Lesson request: `{ "lesson_id": "0", "event_type": "lesson" }`; requires verified quiz evidence.
- MCQ request: `{ "lesson_id": "6", "event_type": "challenge", "answer_index": 1 }`
- Prediction request: `{ "lesson_id": "2", "event_type": "challenge", "answer": "16" }`

Never accept client `user_id`, XP, event key, `ok`, validation result, validator index or reward amount.

Success response fields: `ok`, `status` (`recorded` or `already_recorded`), `lesson_id`, `event_type`, `xp_awarded`, server-derived `total_xp` and `streak`, `newly_unlocked_achievements`, and safe post-answer feedback. Duplicate evidence returns `already_recorded` and zero new XP. If a legacy XP event key exists but evidence does not, create evidence without duplicating XP.

Error codes: 401 `unauthorized`; 405 `method_not_allowed`; 400 `invalid_request`; 404 `unknown_lesson`; 409 `quiz_required`; 422 `invalid_answer` or `unsupported_event`; 429 `rate_limited`; 500 `server_error`.

One service-role-only database transaction must insert evidence, deduplicate `xp_events(user_id,event_key)`, update `user_stats`, and calculate achievements. Evidence uniqueness is `(user_id,lesson_id,event_type)`; retain the historical XP event key `lesson_id:event_type`.

## Legacy-account transition

Keep old visible progress and existing XP/achievements. Do not backfill evidence from old progress flags. For a completed lesson without verified quiz evidence, explain that completion remains saved and ask for only the short quiz to be resubmitted if the learner wants to verify any lesson reward not already recorded. Do not reset the lesson or require rereading. Existing event keys prevent duplicate XP.

## Retry safety

Persist verifier requests in a queue namespaced to the exact authenticated user, such as `pylearn_verified_events:<uid>`. Retry only while that same user is authenticated. Remove definitive outcomes; retain transient network/5xx failures. The queue is not evidence and must never cross account boundaries.

## Development environment — Pylearn-Dev created

The paid Supabase preview branch at US$0.01344/hour remains declined. A separate Free project was authorized, created and verified instead:

- Organization: `zcenoqlgbbmshhkreceg` (Free plan).
- Project: `Pylearn-Dev`.
- Ref: `rhtfripfqwccbhcwgoxy`.
- Region: `eu-west-1`.
- Status at verification: `ACTIVE_HEALTHY`.
- Project creation quote: **$0/month**.
- Production project `vzgbxoxscmlmacxciwze` remains unchanged.

The isolated dev schema was initialized from checked-in dev-only fixtures under `supabase/tests/fixtures/`. It contains synthetic schema only; no production users, auth identities, XP rows, secrets or personal data were copied. A dev-only `auth.users` trigger mirrors production's `handle_new_user` behavior for synthetic accounts.

Use only synthetic test users/data in Pylearn-Dev. Do not create a paid branch. Do not deploy these changes to production without separate review and explicit approval.

## Implementation status

No SQL migration, Edge Function, RPC, frontend change, deployment, or test has been performed under this contract.


## Development environment update — Pylearn-Dev created (2026-11-07)

The user authorized creation provided the new project cost $0. Supabase confirmed the organization `zcenoqlgbbmshhkreceg` is on the Free plan and quoted the project at **$0/month**. The project was created successfully and re## Implementation status — 2026-11-07

### Implemented in Pylearn-Dev

- Dev-only baseline fixture: `supabase/tests/fixtures/pylearn_dev_baseline.sql`.
- Dev-only auth bootstrap fixture: `supabase/tests/fixtures/pylearn_dev_auth_trigger.sql`.
- Additive migration: `supabase/migrations/20261107194500_server_authoritative_learning_rewards.sql`.
- Explicit private-table deny policies: `supabase/migrations/20261107200500_private_reward_tables_deny_policies.sql`.
- Private evidence table `private.learning_reward_evidence`, unique on `(user_id, lesson_id, event_type)`.
- Private attempt timestamp table with a per-user/per-lesson/per-event limit of 10 attempts per 10 minutes. Submitted answers and learner code are not stored.
- Service-role-only private SECURITY DEFINER functions, exposed through public-schema SECURITY INVOKER RPC shims that only `service_role` may execute.
- `public.award_learning_xp` is fail-closed in Pylearn-Dev and no longer accepts client progress flags as reward evidence.
- Edge Function `verify-learning-activity` deployed to Pylearn-Dev, ACTIVE version 1, `verify_jwt=true`. It validates the JWT with Auth `getUser`, derives the user ID from that session, validates server-held quiz/objective-challenge answers, applies the rate limit, then calls the atomic RPC.
- Supported challenge XP is limited to objective challenge lessons 2, 6 and 13. Code/debug/fill checks remain local feedback only and do not award XP.
- Frontend branch changes route Vercel preview deployments to Pylearn-Dev while GitHub Pages and stable Vercel domains remain pointed at production. The frontend no longer contains the 14 quiz answer indexes or the three objective challenge expected answers; it calls the verifier and uses an account-scoped durable retry queue. Old flag-based reward replay and the local Python-run reward call were removed.
- Existing visible progress upserts, notes, bookmarks, reviews and challenge-attempt history remain separate from reward evidence.
- GitHub Actions source checks were added. Run 4 for commit `d5fc0b2ecde4fabe7b35b5365e024f0edb34ad98` completed successfully.

### Tests actually run

- SQL transaction assertions passed for: authenticated-role rejection; legacy RPC rejection despite forged progress flags; lesson prerequisite enforcement; 10 allowed attempts followed by an 11th blocked attempt; quiz +15, lesson +20 and supported challenge +30; duplicate-event idempotency; verified achievement unlocks; unsupported challenge rejection; and historical XP event-key deduplication.
- A synthetic Auth-user transaction confirmed that the dev trigger creates a profile and user_stats row.
- Both test transactions were rolled back. Post-test counts verified zero synthetic Auth users, profiles, stats, XP events, evidence rows and attempt rows remain.
- Supabase security advisor returned no lints.
- GitHub Actions run 4 passed JavaScript syntax and reward-boundary source checks.
- Vercel preview deployment for the feature branch reached READY. Its deployed script was checked to confirm dev-project routing, absence of browser answer keys, and absence of legacy reward calls.

### Not yet verified / not deployed

- No authenticated browser invocation of the Edge Function has been completed yet.
- No full Android Chrome/Samsung Internet regression has been completed yet.
- The preview project's Auth redirect allowlist still needs the feature-preview origin added before email confirmation flow can be tested. Social provider credentials were intentionally not copied; social buttons are hidden in preview.
- No production migration, Edge Function deployment, or production data write has occurred.
- Production remains exposed to the previously audited legacy reward path until the reviewed rollout is separately approved. The existing production `award-python-run` endpoint also remains a separate item to retire/harden; the feature frontend no longer calls it.
- The code-run achievement is deferred until a trustworthy server-side execution receipt exists.

