import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import GameWrapper from "../components/GameWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <GameWrapper>
      <FlexWithGap gap={32}>{children}</FlexWithGap>
    </GameWrapper>
  );
}
