# PyLearn forensic audit — preview branch

**Date:** 2026-11-04  
**Scope:** `architecture/multipage-foundation` and its connected Supabase project.  
**Production safety:** No changes to `main`, GitHub Pages production, Supabase schema, or live auth configuration were made during this audit.

## Executive finding

The current multipage build is an incomplete migration, not a feature-complete replacement for the classic PyLearn application. The classic app remains available as `legacy.html`, but several major systems are only linked back to that page or represented by static placeholder cards. The prior feature-preservation note understated this: the missing work is architectural and functional, not merely polish.

## Evidence: classic application vs multipage build

The classic `script.js` contains approximately 85 named functions. Its page includes these main systems:

- Account sign-in/sign-up and Google/Microsoft providers
- Dashboard, XP, levels, streaks, progress ring and next-step continuation
- Cosmetic/theme locker and learning insights
- Mission board
- 14-lesson learning path, search, roadmap and learning map
- Detailed lessons, quiz, challenge modes, hints and solution reveal
- Python editor, stdin, output, run counter and worker retry
- Study tools: lesson search, saved bookmarks and notes
- Guided project lab, checklists and project completion
- Badge/achievement collection and progress
- Lesson review scheduling

The multipage dashboard currently renders five account metrics and a progress bar. It explicitly sends the learner back to `legacy.html` for missions, themes/insights, saved notes/bookmarks, the full project lab and badges. This is evidence that those systems have not been migrated into the new dashboard.

The multipage Projects page contains six static idea cards. Its own copy says the standalone tracker and saved project completion are not connected. This is not equivalent to the classic interactive project lab.

The multipage Discover page is a short navigation/marketing page, not a replacement for the classic roadmap, map, insights or study hub.

The new lesson page has meaningful restored teaching content and account-backed note/bookmark/review calls, but this does not make the rest of the learning ecosystem complete.

## Backend findings

### Verified healthy foundations

- Supabase has the expected core tables: profiles, user_stats, lesson_progress, user_notes, user_bookmarks, user_achievements, xp_events, lesson_reviews and challenge_attempts.
- RLS is enabled on these public tables.
- The inspected policies scope reads/writes to the authenticated user's own UUID. Update policies include both USING and WITH CHECK.
- Reward writes are routed through the active `award-learning-reward` Edge Function and the `award_learning_xp` database function rather than exposing the service-role key in browser code.
- Both `award-learning-reward` and `award-python-run` Edge Functions are active.
- No database schema changes were made during this audit.

### Missing or incomplete application integration

- The multipage session bridge has no API for the classic mission board, cosmetic/theme locker, insights, roadmap/map, badge collection or interactive project tracker.
- The new Playground does not call a session API to persist challenge-attempt history, despite the `challenge_attempts` table existing. The classic app has a `recordChallengeAttempt` function; the new bridge does not expose its equivalent.
- The new dashboard reads aggregate progress but does not reproduce the classic dashboard's level/next-level calculations, cosmetic unlocks, insights, mission state or badge progress.
- The new Projects page has no project state model or persistence path.
- Profile operations are present in source (profile, email, password, identity display, theme and sign-out), but source inspection alone does not prove the live flows work. These still require signed-in browser testing.
- Auth/session restoration, cross-page refresh behavior, OAuth return URLs and cross-browser persistence require runtime regression tests.

### Database security posture

The inspected RLS rules are owner-scoped. The security advisor's only finding was Supabase leaked-password protection being disabled, a known plan/configuration limitation. The performance advisor reported two unused indexes on challenge_attempts; these are informational and should not be removed without usage analysis.

## CSS and layout findings

- The new app uses a separate shared shell stylesheet plus page-specific CSS; the Playground defines its own visual system. This creates multiple sources of truth for widths, colors, spacing and responsive behavior.
- Shared content is capped at 1080px while the header/footer use 1180px; Playground uses a separate 1680px width. This explains why page widths and alignment do not feel consistent.
- Mobile navigation compresses seven destinations into a fixed seven-column bottom bar with 8px labels. It needs a usability pass on narrow phone widths and safe-area/keyboard behavior.
- Footer branding is generated dynamically after page load, so logo alignment must be tested after the footer is inserted and after theme changes—not inferred from static HTML.
- The legacy page contains a duplicate closing anchor tag near the header logo. It should be cleaned up as part of the classic-page preservation pass.
- CSS source inspection cannot prove mobile rendering, overflow, tap targets, fixed-nav overlap, keyboard behavior or logo placement. Those require real-device checks.

## Verification limitations

The Vercel deployment can be checked for successful builds and HTTP responses, but those checks do not execute the app's JavaScript or prove that Pyodide, Supabase auth, OAuth, editor controls, or responsive layout work. TinyFish sign-in was deliberately not used after the previous personal-account authentication interruption. No account credentials were requested or used.

## Required rebuild order

1. **Create a classic-feature parity matrix** and keep every classic capability accounted for before replacing its entry point.
2. **Unify the application shell and design tokens** (one width system, one theme system, shared responsive rules, mobile keyboard/safe-area handling).
3. **Complete the shared session/data layer** with typed/consistent operations for progress, XP, challenge attempts, notes, bookmarks, reviews, missions, achievements, cosmetics and projects.
4. **Migrate the missing functional systems**: study hub/search, roadmap/map, insights, missions, badge collection, cosmetic locker and full project lab.
5. **Repair and test the Python runtime** in actual Chrome and Samsung Internet, including input, stdout/stderr, exceptions, challenge checks, retries and slow-network startup.
6. **Run end-to-end account tests**: email sign-in/sign-up, Google/Microsoft OAuth, session restoration, profile updates, progress sync, reward idempotency, sign-out and cross-device persistence.
7. **Run mobile and desktop visual regression** on all routes, then verify production parity before any merge.

## Acceptance rule

A page returning HTTP 200 or a deployment reaching READY is not counted as a working feature. A feature is complete only after its UI, data operation, failure state and persistence behavior have been verified. Keep all implementation changes on this preview branch until the user explicitly approves production promotion.
