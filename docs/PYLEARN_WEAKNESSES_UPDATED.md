# Pylearn Weaknesses Updated

**Checkpoint date:** 2026-11-07  
**Repository:** `YAbu528/Pylearn`  
**Purpose:** Canonical, easy-to-find continuation handover for the PyLearn reward-integrity weakness audit and Phase 2 server-authoritative reward milestone.

> This document is the named successor checkpoint requested by the user. A new ChatGPT conversation should fetch and read this file first, then fetch the linked Phase 2 design/contract files before asking the user to repeat context.

## Current status at this checkpoint — updated 2026-11-07

- **Audit:** inspected; 14 quiz answer indexes and the three objective challenge answer rules inventoried.
- **Architecture/contract:** documented. Database/API boundary implemented in isolated Pylearn-Dev; frontend integrated on the feature branch.
- **Development database:** separate Supabase Free project `Pylearn-Dev` created and verified at $0/month; project ref `rhtfripfqwccbhcwgoxy`.
- **Implementation:** database migrations and JWT-verified Edge Function deployed to Pylearn-Dev; frontend changes committed on `feat/server-authoritative-rewards-20261107`.
- **Preview:** Vercel feature-branch deployment reached READY. Preview routes to Pylearn-Dev; GitHub Pages and stable Vercel domains remain pointed at production.
- **Tests:** SQL transaction assertions passed and rolled back; synthetic Auth bootstrap test passed; Supabase security advisor returned no lints; GitHub Actions source-check run 4 passed.
- **Still pending:** Auth redirect allowlist setup, authenticated browser tests, Android Chrome/Samsung Internet regression, and production rollout review.
- **Production:** unchanged. No production migration, Edge Function deployment, or user-data write has occurred. Do not describe the reward weakness as fixed in production.

## Repository and branch references

- Repository: https://github.com/YAbu528/Pylearn
- Live site: https://yabu528.github.io/Pylearn/
- Supabase project ref: `vzgbxoxscmlmacxciwze`
- Phase 1 recovery/audit branch: `audit/reward-integrity-phase1-20261107`
- Phase 2 feature branch: `feat/server-authoritative-rewards-20261107`
- Phase 2 base commit: `faeb179c337d5c063a266086fc2b97b624a6215e`
- Latest Phase 2 feature-branch checkpoint at this update: `d5fc0b2ecde4fabe7b35b5365e024f0edb34ad98`.
- Latest Phase 2 design document commit: `2043762df53161378b4836b641f95e5899ffb02f`.
- Latest Phase 2 contract document commit: `a17c4efa5b2d884404734065413a81d19e47b932`.
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

## Development database — paid branch declined; Free project created

The user explicitly declined a Supabase development branch at **US$0.01344/hour**. Do not create a paid branch unless the user independently reopens that option.

A separate Free project was subsequently authorized and created after a $0 cost quote:
- Organization: `zcenoqlgbbmshhkreceg`, plan `free`.
- Project: `Pylearn-Dev`.
- Project ref: `rhtfripfqwccbhcwgoxy`.
- Region: `eu-west-1`.
- Status: `ACTIVE_HEALTHY`.
- Project creation quote: `$0/month`.
- Production project: `vzgbxoxscmlmacxciwze`, unchanged.

Dev-only fixtures:
- `supabase/tests/fixtures/pylearn_dev_baseline.sql`
- `supabase/tests/fixtures/pylearn_dev_auth_trigger.sql`

Use synthetic test users and data only. Do not copy production users, auth identities, XP history, personal data or secrets. Free project inactivity pausing is acceptable for this test environment. The paid branch remains declined.

## Completed in this conversation

- Re-fetched the original Phase 1 handover and Phase 2 design before continuing.
- Re-inspected current feature-branch `script.js` and `python-worker.js`.
- Extracted all 14 quiz answer indexes and the 3 objective challenge expected answers/normalization rules.
- Rechecked Supabase project details and development branches (none found).
- Retrieved current development branch hourly cost quote.
- No source code or database was changed during inspection.

## Exact next session entry point

1. Read this handover first, then fetch the Phase 2 design and contract documents on `feat/server-authoritative-rewards-20261107`.
2. Add the Vercel feature-preview origin to Supabase Pylearn-Dev Authentication → URL Configuration → Redirect URLs. Current branch alias: `https://pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app/**`.
3. Test email signup/sign-in with a synthetic development account only. Social provider credentials were intentionally not copied; social buttons are hidden in preview.
4. Run authenticated Edge Function tests and mobile browser regression in Android Chrome and Samsung Internet.
5. Fix any failures and re-run the source/SQL test matrix. Keep all work on the feature branch and Pylearn-Dev.
6. Do not deploy any migration/function or merge to production without a separate review and explicit user approval. The production `award-python-run` endpoint remains a separate hardening/retirement item; code-run achievement is deferred.
7. Keep this handover current and fetch it again after substantial checkpoints.

## Companion contract document

The full API request/response contract, 14 quiz answer indexes, objective challenge normalization, legacy-account transition, and development-environment gate are also recorded in [SERVER_AUTHORITATIVE_REWARDS_CONTRACT.md](https://github.com/YAbu528/Pylearn/blob/feat/server-authoritative-rewards-20261107/docs/SERVER_AUTHORITATIVE_REWARDS_CONTRACT.md) on `feat/server-authoritative-rewards-20261107`.


## Session checkpoint — Pylearn-Dev reward-integrity implementation started (2026-11-07)

### Environment
- Pylearn-Dev: ref `rhtfripfqwccbhcwgoxy`, organization `zcenoqlgbbmshhkreceg`, Free plan, region `eu-west-1`, status `ACTIVE_HEALTHY`, verified project creation quote $0/month.
- Production Pylearn remains `vzgbxoxscmlmacxciwze`; no production writes or deployments were made.
- Paid Supabase preview branch at US$0.01344/hour remains declined.

### Dev database and migrations
- Dev-only baseline fixture: `supabase/tests/fixtures/pylearn_dev_baseline.sql`.
- Dev-only Auth trigger fixture: `supabase/tests/fixtures/pylearn_dev_auth_trigger.sql`; mirrors production `handle_new_user` to create profile and user_stats rows for synthetic users.
- Additive migration applied only to Pylearn-Dev: `20261107194500_server_authoritative_learning_rewards.sql`.
- Explicit private-table deny-policy migration applied only to Pylearn-Dev: `20261107200500_private_reward_tables_deny_policies.sql`.
- Private evidence and attempt tables are not browser-readable. Public RPC shims are SECURITY INVOKER and execute-only for service_role; private SECURITY DEFINER implementations use an empty search_path and explicit service_role JWT checks.
- Old `public.award_learning_xp` fails closed in Pylearn-Dev. It rejects the legacy client-progress flag path.
- Rate limit: 10 attempts per 10 minutes per user/lesson/event. Answers and learner code are not stored.

### Edge Function and frontend
- `verify-learning-activity` deployed to Pylearn-Dev, ACTIVE version 1, `verify_jwt=true`.
- Function validates the JWT with Auth `getUser`, derives user ID from the authenticated session, validates all 14 quiz answer indexes and objective challenge answers for lesson IDs 2, 6 and 13, then calls the atomic RPC.
- Frontend `script.js` on the feature branch no longer ships the 14 quiz answer indexes or objective challenge expected answers. Quiz and supported objective challenge submissions use the verifier.
- Account-scoped retry queue key: `pylearn_verified_events:<uid>`. It retains transient network/5xx failures and cannot submit one user's queue under another account.
- Old flag-based reward replay and the `award-python-run` frontend call were removed. Code/debug/fill challenges keep local feedback but award no XP until trusted validators exist.
- Visible progress upserts, notes, bookmarks, reviews and challenge-attempt history remain independent.
- Vercel preview deployments use Pylearn-Dev. GitHub Pages and stable Vercel domains remain on production. Preview social sign-in is hidden because OAuth credentials were intentionally not copied.

### Tests actually run
- SQL transaction assertions passed for service-role authorization, forged-progress legacy RPC rejection, lesson quiz prerequisite, 10/10 rate limit, quiz +15 XP, lesson +20 XP, supported challenge +30 XP, duplicate idempotency, achievement unlocks, unsupported challenge rejection and legacy XP-event deduplication.
- Auth bootstrap transaction confirmed synthetic auth user creates profile and user_stats.
- Both SQL test transactions rolled back; post-test counts verified zero synthetic auth users, profiles, user_stats, XP events, evidence rows and attempts.
- Supabase security advisor returned no lints.
- GitHub Actions run 4 passed source checks (Node syntax checks for script.js and python-worker.js plus answer-key/legacy-call guards).
- Vercel preview deployment for feature branch reached READY; deployed script inspected to confirm preview dev-project routing, no client answer keys and no legacy reward calls.

### Remaining gates / risks
- Add current Vercel preview origin to Pylearn-Dev Auth Redirect URLs: `https://pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app/**`.
- Complete authenticated browser testing and Android Chrome/Samsung Internet regression.
- No authenticated browser invocation of the Edge Function has been completed yet.
- Production still has the audited legacy reward path and the separate `award-python-run` endpoint active until a separately approved production rollout. Do not say the weakness is fixed in production.
- Do not merge or deploy to production without a complete test matrix, rollback review and explicit user approval.

### Latest feature-branch references
- Branch: `feat/server-authoritative-rewards-20261107`
- Latest feature-branch HEAD after documentation updates: `2043762df53161378b4836b641f95e5899ffb02f`.
- Latest app-source preview deployment commit: `d5fc0b2ecde4fabe7b35b5365e024f0edb34ad98` (Vercel READY).
- Design doc commit: `2043762df53161378b4836b641f95e5899ffb02f`.
- Contract doc commit: `a17c4efa5b2d884404734065413a81d19e47b932`.
- Preview alias: `pylearn-git-feat-server-authoritative-abc05f-yabu528s-projects.vercel.app`.
