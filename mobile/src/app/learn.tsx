import { ContentCard, ScreenShell } from "@/components/screen-shell";

export default function LearnScreen() {
  return (
    <ScreenShell eyebrow="LEARNING PATH" title="Learn Python, one idea at a time." description="A clear path from your first line of code to the concepts that help you build useful things.">
      <ContentCard label="CURRICULUM" title="Your lessons are being connected." description="The lesson catalog and curriculum structure will be brought into the native app in the next learning milestone. No lesson progress is being simulated here." tone="blue" />
      <ContentCard label="WHAT COMES FIRST" title="Python foundations" description="Variables, values, data types, conditions, loops, and functions form the starting point for the learning path." />
      <ContentCard label="BUILT FOR LEARNING" title="Learn, then try it." description="Lessons will connect directly to short exercises so you can practise each concept as you go." />
    </ScreenShell>
  );
}
