# PyLearn Mobile

Native Android-first PyLearn application built with Expo, React Native, TypeScript, and Expo Router.

## Current implementation

- Isolated under `/mobile`; the existing root website remains untouched.
- Expo SDK 57 dependency line and TypeScript strict mode.
- Five working Expo Router tabs: Home, Learn, Practice, Projects, and Profile.
- Shared screen shell and visual tokens for consistent mobile layouts.
- Home navigation cards link to the corresponding app areas.
- Screens explicitly identify curriculum, Python runtime, projects, account, and progress integrations that are not connected yet.
- No Supabase credentials, production configuration, or user data are included.

## Local development

From this directory:

```sh
npm install
npx expo start
```

Open the project with an Expo Go version compatible with SDK 57. For custom release builds, use the repository's public GitHub Actions validation workflow; do not assume paid cloud build services are free.

## Current verification boundary

The first standalone Android foundation APK was built with a bundled JavaScript asset and was installed on a Samsung Galaxy A15 (Android 14 / One UI 6.1). The user confirmed that the initial screen rendered and that one full close/reopen cycle rendered again successfully.

The five-tab implementation is now committed to `mobile/expo-foundation`. Its GitHub Actions validation/build run is pending at the latest recorded check. The new navigation and screens have not yet been confirmed on a device. Do not treat source commits or a queued workflow as proof of a successful build or device test.

## Next implementation stages

1. Verify this five-tab build in GitHub Actions and on the Galaxy A15.
2. Inventory and connect the existing curriculum and lesson content.
3. Implement real lesson reading, completion, and quizzes.
4. Review mobile authentication and data contracts before any Supabase integration.
5. Design the Python playground only after a safe, zero-cost execution approach is established.
