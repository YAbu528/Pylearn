# Pylearn Weaknesses Updated

**Checkpoint date:** 2026-11-07  
**Repository:** `YAbu528/Pylearn`  
**Purpose:** Canonical, easy-to-find continuation handover for the PyLearn reward-integrity weakness audit and Phase 2 server-authoritative reward milestone.

> This document is the named successor checkpoint requested by the user. A new ChatGPT conversation should fetch and read this file first, then fetch the linked Phase 2 design/contract files before asking the user to repeat context.

## Current status at this checkpoint

- **Audit:** inspected.
- **Architecture:** proposed and documented.
- **Answer-key inventory:** completed for all 14 lessons.
- **Objective challenge inventory:** completed for the two prediction challenges and one multiple-choice challenge.
- **API contract:** specified as a proposal; not implemented.
- **Legacy-account transition:** specified as a proposal; not implemented.
- **Development database:** no Supabase development branches exist. A branch cost quote was obtained; no branch was created.
- **Implementation:** not started.
- **Production:** unchanged. No production SQL, migration, RLS/grant change, Edge Function deployment, or user-data write was performed.
- **Testing:** no automated integration/security tests or mobile browser regression tests were run in this checkpoint. Do not describe the weakness as fixed.

## Repository and branch references

- Repository: https://github.com/YAbu528/Pylearn
- Live site: https://yabu528.github.io/Pylearn/
- Supabase project ref: `vzgbxoxscmlmacxciwze`
- Phase 1 recovery/audit branch: `audit/reward-integrity-phase1-20261107`
- Phase 2 feature branch: `feat/server-authoritative-rewards-20261107`
- Phase 2 base commit: `faeb179c337d5c063a266086fc2b97b624a6215e`
- Latest known Phase 2 design commit before this checkpoint: `9bb87f04b3fbec6ac6b61b27ae3b343e5aec3f7f`
- PR #38 source-recovery merge commit on main: `faeb179c337d5c063a266086fc2b97b624a6215e`
- PR #38: https://github.com/YAbu528/Pylearn/pull/38
- Original Phase 1 handover: https://github.com/YAbu528/Pylearn/blob/audit/reward-integrity-phase1-20261107/docs/REWARD_INTEGRITY_PHASE1_HANDOVER.md
- Phase 2 design: https://github.com/YAbu528/Pylearn/blob/feat/server-authoritative-rewards-20261107/docs/SERVER_AUTHORITATIVE_REWARDS_DESIGN.md

## User's mandatory continuity and quality rules

1. Keep this named handover current throughout substantial work.
2. Record exact branches, commits, files, database objects, implementation state, tests actually run, results, and remaining risks.
3. Clearly distinguish inspected, proposed, implemented, preview-tested, and production-deployed.
4. Never claim a fix or test succeeded without actually inspecting the result.
5. Before ending a substantial session, commit the checkpoint and fetch it again from GitHub to verify the saved content.
6. A new chat must read this file first and should not ask the user to repeat known project context.
7. Work on the Phase 2 feature branch. Do not make production database/function changes without explicit review and approval.
8. Small changes can be made without advance announcement; announce major changes.

## Confirmed weakness baseline

Live Supabase project `vzgbxoxscmlmacxciwze`:

- `award-learning-reward`: ACTIVE version 3, `verify_jwt=true`.
- `award-python-run`: ACTIVE version 1, `verify_jwt=true`.
- The service-role-only `public.award_learning_xp(uuid,text,text,text)` RPC is SECURITY DEFINER, has an empty search_path and explicitly checks the service_role JWT. Keep these protections.
- The RPC currently trusts client-writable `public.lesson_progress` fields: `quiz_best_score`, `completed`, and `challenge_completed`.
- Existing reward values are quiz 15 XP, lesson 20 XP, challenge 30 XP.
- `public.xp_events` deduplicates on `(user_id,event_key)`; existing event keys are `<lesson_id>:<event_type>`.
- Authenticated users can write their own progress rows under RLS but cannot directly write the reward tables.
- `challenge_attempts` is client-originated activity history, not trusted reward evidence.
- Frontend local quiz state and Worker result are currently trusted by UI reward paths.
- The Python-run achievement is requested from local `state.runs >= 1`; the server does not independently verify execution.

Relevant live row counts at prior read-only inspection: 9 profiles/user-stat rows, 126 lesson-progress rows, 87 XP-event rows, 21 achievement rows, 18 challenge-attempt rows. These are historical inspection-time aggregate counts, not live guarantees.

Applied migration IDs at prior inspection: `20261024171501`, `20261024181332`, `20261024181913`, `20261024182004`, `20261025120628`, `20261027163024`, `20261031181048`.

### Protections and user data to preserve

- Existing Supabase accounts and auth providers.
- Existing XP totals, XP event history, achievements and event keys.
- Existing visible lesson progress and cross-device sync.
- Notes, bookmarks, lesson reviews, challenge-attempt history.
- RLS user isolation, service-role-only reward writes, JWT validation and idempotency.
- Sign-in/sign-out and account switching.

Never backfill trusted evidence from old client-writable progress flags. Never reset users or recalculate/delete historical XP or achievements.

## Exact source inventory

Inspected on `feat/server-authoritative-rewards-20261107`:

- `script.js`, blob SHA `a2144b358d104c395c5dd800db76d12ba641af14`.
- `python-worker.js`, blob SHA `77da2d933177045028def3e1837a1c6ee6cf384c`.

### All 14 browser-shipped quiz answer keys

Indexes are zero-based lesson IDs and zero-based answer indexes.

| Lesson ID | Lesson | Quiz answer index | Explanation |
|---:|---|---:|---|
| 0 | Python Basics: variables & print() | 1 | A single `=` assigns the right-side value to the name on the left. |
| 1 | Data Types: strings, integers & floats | 2 | 3.14 has a decimal part, so it is a float. |
| 2 | Operators & input() | 0 | `input()` returns text; `int()` converts numeric text to an integer. |
| 3 | Conditions: if, elif & else | 1 | `=` assigns; `==` compares two values. |
| 4 | Loops: for & while | 0 | `range(1, 5)` produces 1, 2, 3, 4. |
| 5 | Functions: reusable code | 1 | `return` sends a value back to the caller. |
| 6 | Lists & dictionaries | 1 | The first list item is at index 0. |
| 7 | Errors & modules | 1 | Python uses `import` followed by the module name. |
| 8 | String Skills | 0 | `text[0:3]` for `"Python"` returns `"Pyt"`. |
| 9 | Tuples & sets | 1 | A set stores unique elements. |
| 10 | Comprehensions | 0 | `range(3)` gives 0, 1, 2; doubling produces `[0, 2, 4]`. |
| 11 | File handling | 1 | `w` opens a file for writing and replaces old contents. |
| 12 | Object-oriented Python | 0 | An object is an instance of a class. |
| 13 | APIs & JSON | 0 | Python's built-in `json` module parses JSON text. |

The question, options, answer index and explanation are all currently bundled in `script.js` lesson definitions. The future browser payload must not contain the answer index. Explanations can be returned as safe post-submission feedback.

### All objective challenge reward candidates

Current lesson challenge modes by lesson ID:

`0 code, 1 code, 2 predict, 3 debug, 4 code, 5 code, 6 mcq, 7 code, 8 fill, 9 code, 10 debug, 11 code, 12 code, 13 predict`.

Initial server-verifiable challenge scope is deliberately limited to:

| Lesson ID | Mode | Expected answer | Current client normalization |
|---:|---|---|---|
| 2 | predict | `16` | Trim outer whitespace, then case-insensitive string equality. |
| 6 | mcq | answer index `1` (`sum(numbers)`) | Exact integer option index. |
| 13 | predict | `95` | Trim outer whitespace, then case-insensitive string equality. |

Do not use loose substring matching. Pin a validator version and test whitespace/case behavior. Do not award authoritative challenge XP for code, debug or fill modes in the first release. Keep their local feedback only, and never trust a Worker `ok:true` result for XP.

Worker flaw: `python-worker.js` currently uses `validators[Number(validatorIndex)] || "valid = True"`; an invalid index defaults to success. Correct this for local feedback reliability if touching the Worker, but it must never be a server reward gate.

## Proposed server event contract

Proposed Edge Function: `verify-learning-activity`, JWT required. Authenticate with Supabase Auth `getUser(token)`; derive user identity only from the validated JWT.

Endpoint: `POST /functions/v1/verify-learning-activity`

Strict request allowlist:

- Quiz: `{ "lesson_id": "0", "event_type": "quiz", "answer_index": 1 }`
- Lesson: `{ "lesson_id": "0", "event_type": "lesson" }`; server requires verified quiz evidence for that same user and lesson.
- Objective MCQ: `{ "lesson_id": "6", "event_type": "challenge", "answer_index": 1 }`
- Objective prediction: `{ "lesson_id": "2", "event_type": "challenge", "answer": "16" }` or lesson 13 with `"95"`.

Reject or ignore client-supplied `user_id`, XP amount, event key, `ok`, validation result, validator index, and reward amount. Unknown request properties should be rejected to keep the boundary explicit.

Proposed successful response:

```json
{
  "ok": true,
  "status": "recorded",
  "lesson_id": "0",
  "event_type": "quiz",
  "xp_awarded": 15,
  "total_xp": 135,
  "streak": 2,
  "newly_unlocked_achievements": [],
  "feedback": {
    "correct": true,
    "explanation": "A single = assigns a value."
  }
}
```

For an already-recorded evidence event, return HTTP 200 with `status: "already_recorded"` and `xp_awarded: 0`. A new evidence row whose legacy XP event key already exists may return `status: "recorded"` and `xp_awarded: 0`; it must not duplicate historical XP. Totals must be server-derived.

Proposed stable error responses:

- 401 `unauthorized`: missing/invalid session.
- 405 `method_not_allowed`: non-POST request.
- 400 `invalid_request`: malformed JSON, unknown property or invalid shape.
- 404 `unknown_lesson`: lesson ID not in the server catalog.
- 409 `quiz_required`: lesson event attempted without verified quiz evidence.
- 422 `invalid_answer`: wrong quiz/challenge answer.
- 422 `unsupported_event`: challenge mode is not in the initial supported set.
- 429 `rate_limited`: bounded abuse/guessing protection.
- 500 `server_error`: transient/internal failure; client may retry safely.

The database transaction must atomically insert private evidence, create/dedupe the existing `xp_events` key, update `user_stats`, and calculate new achievements. Unique evidence key: `(user_id, lesson_id, event_type)`. Existing XP key format remains `lesson_id:event_type`.

## Legacy-account transition UX

- Preserve the user's existing completed/quiz/challenge progress display and existing XP/achievements.
- Never silently convert old client flags into verified evidence.
- When a legacy completed lesson has no trusted quiz evidence, explain that the saved completion remains intact; the learner only needs to retake that short quiz if they want to verify the prerequisite for any lesson reward not already recorded.
- Do not require rereading the lesson or reset its completion state.
- Existing XP event keys remain authoritative for dedupe: if quiz/lesson XP was already granted historically, verification can create missing trusted evidence without granting that XP again.
- If a quiz was historically marked complete but has no trusted evidence, the learner must submit a correct answer to the server before the lesson event can be verified.
- Show pending/network retry separately from incorrect-answer feedback. Never tell the learner XP was earned until the server confirms it.

## Pending request retry and account switching

Use a durable queue namespaced by exact account ID, for example `pylearn_verified_events:<uid>`. Queue only verifier request payloads and local metadata; it is transport state, never evidence. On retry, compare the currently authenticated user ID with the queue namespace before sending. Never submit one account's queued event under another account. Remove requests after a definitive accepted/already-recorded/invalid-answer response; retain only transient network/5xx failures with bounded retry/backoff. Ensure sign-out and account switch do not migrate queue contents.

## Development database decision — paid branch declined; free alternative preferred

The user explicitly declined authorization to create a Supabase development branch at **US$0.01344/hour**. No branch was created. Do not ask again to create a paid branch unless the user independently reopens that option.

Fresh account/project inspection:
- Supabase currently lists one project accessible to the account: `Pylearn` (`vzgbxoxscmlmacxciwze`).
- Organization ID: `zcenoqlgbbmshhkreceg`.
- No Supabase development branches exist.
- Supabase's current official Free-plan documentation says an account may have **two active Free projects total** across organizations where the user is Owner or Administrator. Free projects have a 500 MB database quota and can pause after one week of inactivity. The current project list shows one project, so a second Free project may be available, but confirm the account-wide quota and Free-plan organization before creating it.
- Official references: [Free-plan project limits and billing](https://supabase.com/docs/guides/platform/billing-on-supabase), [current pricing and Free-plan limits](https://supabase.com/pricing), [local development requirements](https://supabase.com/docs/guides/local-development).

Preferred no-cost route:
1. If the account has its second Free project slot available, create a separate disposable project named e.g. `Pylearn-Dev` under the existing Free organization. It must be confirmed as **$0** before creation; do not accept any paid compute or upgrade prompt.
2. Use synthetic test users and synthetic seed data only. Do not copy production user rows, auth identities, XP history, or secrets into development.
3. Apply only the new additive migrations and test Edge Function/RPC behavior in that isolated project. Keep production untouched.
4. Free project inactivity pausing is acceptable for this small test environment; resume it when needed. Monitor storage and quota.
5. If the second Free slot is unavailable, use a GitHub Actions ephemeral PostgreSQL service for SQL/RPC transaction and schema tests (no persistent database charge), plus source-level/type/unit tests for Edge Function logic. This does not fully reproduce Supabase Auth/Edge Runtime integration, so defer end-to-end Supabase integration tests until a free isolated Supabase project is available.

Local Supabase CLI is not the recommended path for the user's current Android-only setup: the official local stack requires a container runtime such as Docker/Podman, and the user's available devices are not suitable for running the full stack.

**Authorization state:** The user has declined the paid preview branch. A second Free project has only been recommended, not authorized or created. Ask before creating it. Never run DDL or deploy test functions to production as a substitute.

## Completed in this conversation

- Re-fetched the original Phase 1 handover and Phase 2 design before continuing.
- Re-inspected current feature-branch `script.js` and `python-worker.js`.
- Extracted all 14 quiz answer indexes and the 3 objective challenge expected answers/normalization rules.
- Rechecked Supabase project details and development branches (none found).
- Retrieved current development branch hourly cost quote.
- No source code or database was changed during inspection.

## Exact next session entry point

1. Read this file first.
2. Fetch `docs/SERVER_AUTHORITATIVE_REWARDS_DESIGN.md` and the Phase 2 contract addendum on `feat/server-authoritative-rewards-20261107`.
3. Ask the user whether to authorize a Supabase development branch at US$0.01344/hour (or choose another isolated dev database). Do not create it without approval.
4. Once an isolated database is available, implement the additive private evidence migration, atomic RPC and JWT-verified Edge Function on the feature branch; do not deploy to production.
5. Then implement frontend routing/retry and run the security/compatibility matrix. Keep the named handover updated and verify every saved checkpoint.


## Companion contract document

The full API request/response contract, 14 quiz answer indexes, objective challenge normalization, legacy-account transition, and development-environment gate are also recorded in [SERVER_AUTHORITATIVE_REWARDS_CONTRACT.md](https://github.com/YAbu528/Pylearn/blob/feat/server-authoritative-rewards-20261107/docs/SERVER_AUTHORITATIVE_REWARDS_CONTRACT.md) on `feat/server-authoritative-rewards-20261107`.


## Session checkpoint — declined paid branch; selected free testing strategy (2026-11-07)

- User explicitly declined the Supabase preview branch at US$0.01344/hour. No branch or paid resource was created.
- Rechecked Supabase project listing: one accessible project, `Pylearn`; no development branches. The organization ID is `zcenoqlgbbmshhkreceg`.
- Checked current official Supabase documentation: Free plan allows two active projects total across organizations where the user is Owner/Admin; Free project database quota is 500 MB; Free projects may pause after one week of inactivity.
- Recommended first choice: a separate second Free Supabase project, only if the account-wide free-project slot is available and the create flow confirms $0. This is not yet authorized or created.
- Fallback if no free slot: GitHub Actions ephemeral PostgreSQL for database/schema/transaction tests plus local/source-level tests for Edge Function logic. This will not fully test Supabase Auth/Edge Runtime integration.
- Local Supabase CLI/Docker is not practical for the user's current Android-only environment.
- No source implementation, SQL migration, Supabase project creation, production write, deployment, or tests were performed.

### Next session entry point

1. Read this handover first and fetch the Phase 2 design and event contract.
2. Ask whether the user authorizes creating a separate **$0 Free-plan** Supabase project, after confirming the second Free-project slot is available. Do not create it without explicit approval; if any cost is quoted, stop.
3. If approved and free, create it, verify its plan/quota/region/status, then use only synthetic test users/data.
4. If not available or not approved, prepare a GitHub Actions ephemeral PostgreSQL test harness and continue source-level implementation/tests without touching production.
5. Keep the named handover updated and fetch it again after each substantial checkpoint.


## Session checkpoint — free development project created and verified (2026-11-07)

- User explicitly authorized creation of `Pylearn-Dev` only if the project cost was $0 and the Free-plan allowance permitted it.
- Rechecked the only listed Supabase organization: `zcenoqlgbbmshhkreceg`; its plan was confirmed as `free` / `tier_free`.
- Rechecked account-visible projects before creation: only the production `Pylearn` project (`vzgbxoxscmlmacxciwze`) was listed.
- Supabase quoted the new project at **$0/month**. A zero-cost confirmation ID was obtained, and the project creation call succeeded.
- Created **`Pylearn-Dev`** in organization `zcenoqlgbbmshhkreceg`, region `eu-west-1`.
- New development project ref: **`rhtfripfqwccbhcwgoxy`**.
- Immediately fetched project details after creation. Verified: `status: ACTIVE_HEALTHY`, region `eu-west-1`, PostgreSQL 17.11, and the expected project name/ref.
- This is a separate project. No production project settings, schema, migrations, Edge Functions, users, or data were changed. No data was copied from production.
- **Next:** use this project only for synthetic test users and synthetic seed data. Before any DDL or Edge Function deployment, inspect the new project's current state and prepare additive migrations/function implementation on the Phase 2 GitHub feature branch. Keep all production changes out of scope until separately reviewed and explicitly authorized.
- No reward-integrity implementation or tests have been completed yet. The weakness remains open; creating the isolated development database is an environment milestone, not a fix.

### Current environment identifiers

| Environment | Project | Ref | Region | State |
|---|---|---|---|---|
| Production (unchanged) | Pylearn | `vzgbxoxscmlmacxciwze` | `eu-west-1` | Existing project |
| Development (new) | Pylearn-Dev | `rhtfripfqwccbhcwgoxy` | `eu-west-1` | `ACTIVE_HEALTHY` |

**Cost verification:** Supabase's project cost quote returned `amount: 0`, `recurrence: monthly`. No paid branch or paid resource was created.
