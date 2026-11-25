# PyLearn Mobile

Native Android-first PyLearn application built with Expo, React Native, TypeScript, and Expo Router.

## Current implementation

- Isolated under `/mobile`; the existing root website remains untouched.
- Expo SDK 57 dependency line and TypeScript strict mode.
- Five working Expo Router tabs: Home, Learn, Practice, Projects, and Profile.
- Shared screen shell and visual tokens for consistent mobile layouts.
- Home navigation cards link to the corresponding app areas.
- The Learn area now contains a typed, offline curriculum module sourced from the existing website's `main/script.js` lesson model.
- Fourteen source lessons are available with their original titles, explanations, analogies, code examples, objectives, and quiz questions.
- Each lesson has a native detail route, readable code sample, objectives, an interactive multiple-choice knowledge check with feedback/retry, and a next-lesson link.
- The first five foundation lessons also include source-preserved step-by-step explanations, common mistakes, quick recaps, and three optional ungraded practice tasks each, with starter code, hints, and revealable sample solutions.
- Guided explanations and practice are currently available for Python Basics, Data Types, Operators & input(), Conditions, and Loops. The remaining nine lessons still use the core lesson format until their source guidance is ported.
- Practice tasks are educational prompts only; no Python code execution, XP, lesson completion, or saved progress is connected yet.
- Lesson content is bundled with the app; opening lessons does not require downloading a Python runtime.
- Lesson completion, quiz scores, XP, account identity, and cloud progress are not saved or simulated yet.
- Practice runtime, project catalog, authentication, and Supabase integration are not connected.
- No Supabase credentials, production configuration, or user data are included.

## Local development

From this directory:

```sh
npm install
npx expo start
```

Open the project with an Expo Go version compatible with SDK 57. For standalone release APK validation, use the repository's public GitHub Actions workflow; do not assume paid cloud build services are free.

## Verification boundary

- The previous five-tab APK was built by GitHub Actions and the user reports testing Home, Learn, Practice, Projects, Profile, and the Home links on a Samsung Galaxy A15. The user confirmed each destination opened as expected.
- The current curriculum and lesson-detail implementation was committed after that device test. It has not yet passed CI or been installed and tested on the phone.
- A successful CI type-check/build will not by itself prove the lesson navigation, quiz interaction, screen layout, or scrolling works on the Galaxy A15.

## Next implementation stages

1. Validate the curriculum build in GitHub Actions and test the lesson list, all lesson details, quizzes, retry behavior, next-lesson links, scrolling, and narrow-screen layout on the Galaxy A15.
2. Expand lesson content using the existing source material, including the detailed step-by-step explanations and practice challenges.
3. Design lesson completion and progress only after reviewing the existing web/backend data contracts and deciding how to avoid duplicate or conflicting state.
4. Review mobile authentication and data contracts before any Supabase integration.
5. Design the Python playground only after a safe, zero-cost execution approach is established.
