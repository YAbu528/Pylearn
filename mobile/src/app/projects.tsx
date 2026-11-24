import { ContentCard, ScreenShell } from "@/components/screen-shell";

export default function ProjectsScreen() {
  return (
    <ScreenShell eyebrow="BUILD WITH PYTHON" title="Make ideas real." description="Projects will help you combine concepts, solve problems, and create things you can be proud of.">
      <ContentCard label="PROJECT LIBRARY" title="Guided projects are coming next." description="The project catalog has not been connected to the mobile app yet. This space is reserved for step-by-step builds and saved work." tone="blue" />
      <ContentCard label="HOW IT WILL WORK" title="Plan. Code. Improve." description="Each project will have a clear goal, manageable steps, and room to experiment as your skills grow." />
    </ScreenShell>
  );
}
