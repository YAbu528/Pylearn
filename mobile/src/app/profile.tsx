import { ContentCard, ScreenShell } from "@/components/screen-shell";

export default function ProfileScreen() {
  return (
    <ScreenShell eyebrow="YOUR SPACE" title="Your learning, your way." description="Your account, learning activity, and personal settings will come together here.">
      <ContentCard label="ACCOUNT" title="Guest foundation" description="Sign-in is not connected in this build. Your existing website account and data have not been changed or linked to this app." tone="dark" />
      <ContentCard label="YOUR PROGRESS" title="A complete learning picture." description="XP, levels, streaks, lesson history, notes, bookmarks, and achievements will be connected after the mobile account and data foundations are ready." />
      <ContentCard label="PERSONAL SETTINGS" title="Make the app yours." description="Theme, accessibility, and learning preferences will be added with their real settings behavior—not as decorative controls." />
    </ScreenShell>
  );
}
