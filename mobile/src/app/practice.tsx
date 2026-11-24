import { ContentCard, ScreenShell } from "@/components/screen-shell";

export default function PracticeScreen() {
  return (
    <ScreenShell eyebrow="PRACTICE SPACE" title="Turn understanding into skill." description="A place to experiment with Python, work through challenges, and learn by doing.">
      <ContentCard label="PYTHON PLAYGROUND" title="Your coding workspace is next." description="The editor and Python runtime have not been connected to this native app yet. We will choose the execution approach only after checking device impact, safety, data use, and zero-cost limits." tone="dark" />
      <ContentCard label="CHALLENGES" title="Short exercises with purpose." description="Practice activities will be linked to the lessons they reinforce, with clear feedback when an answer needs another try." />
    </ScreenShell>
  );
}
