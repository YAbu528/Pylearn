# PyLearn verified learning event contract

**Status:** Proposed contract; not implemented.  
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

## Development environment gate — paid branch declined

The user explicitly declined the Supabase preview branch at US$0.01344/hour. Do not create one.

Supabase currently lists one accessible project (`Pylearn`). Official current Free-plan documentation allows two active Free projects total across organizations where the user is Owner/Administrator, with 500 MB database quota per Free project; Free projects may pause after one week of inactivity. Therefore, a separate second Free project is the preferred no-cost integration-test environment if the account-wide slot is available and project creation confirms $0. It has not been authorized or created. Ask before creating it, and stop if any cost is shown.

Use synthetic test users/data only. Never copy production auth users, personal data, XP history, or secrets. If a second Free project is unavailable or not approved, use GitHub Actions ephemeral PostgreSQL for SQL/schema/transaction tests and source-level/unit tests for Edge Function logic; acknowledge that this does not fully exercise Supabase Auth/Edge Runtime. Local Supabase CLI is not recommended for the current Android-only setup because the local stack requires Docker/Podman or another supported container runtime.

Official references:
- https://supabase.com/docs/guides/platform/billing-on-supabase
- https://supabase.com/pricing
- https://supabase.com/docs/guides/local-development

## Implementation status

No SQL migration, Edge Function, RPC, frontend change, deployment, or test has been performed under this contract.


## Development environment update — Pylearn-Dev created (2026-11-07)

The user authorized creation provided the new project cost $0. Supabase confirmed the organization `zcenoqlgbbmshhkreceg` is on the Free plan and quoted the project at **$0/month**. The project was created successfully and re-fetched for verification:

- Name: `Pylearn-Dev`
- Project ref: `rhtfripfqwccbhcwgoxy`
- Organization: `zcenoqlgbbmshhkreceg`
- Region: `eu-west-1`
- Status: `ACTIVE_HEALTHY`
- PostgreSQL: 17.11

This replaces the earlier statement that the free project was merely proposed/not yet authorized. Use this isolated project for synthetic test users and synthetic data only. Do not copy production users, auth identities, personal data, XP history, or secrets. No schema changes, migrations, functions, or tests have yet been run in the new project. Production project `vzgbxoxscmlmacxciwze` remains unchanged. The paid preview branch remains declined and must not be created.
