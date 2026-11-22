# PyLearn Mobile

Native Android-first PyLearn application built with Expo, React Native, TypeScript, and Expo Router.

## Current foundation

- Isolated under `/mobile`; the existing root website is untouched.
- Expo SDK 57 dependency line, selected for compatibility with the current Expo Go transition documented by Expo.
- TypeScript strict mode and Expo Router file-based navigation.
- No backend credentials or production configuration are included.

## Local development

From this directory:

```sh
npm install
npx expo start
```

Open the project with an Expo Go version compatible with SDK 57. For a custom development or release build, first confirm the available no-cost build options; do not assume a cloud build is free.

## Verification status

This is a source-only scaffold created through GitHub's repository API. Dependency installation, type-checking, Metro startup, Expo Go launch, and physical-device testing have not yet been run. Do not treat the foundation as runtime-verified until those checks pass.
