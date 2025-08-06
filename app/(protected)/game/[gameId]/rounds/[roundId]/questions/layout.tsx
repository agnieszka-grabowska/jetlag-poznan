import GameWrapper from "../components/GameWrapper";

export default function Layout({ children }: { children: React.ReactNode }) {
  return <GameWrapper>{children}</GameWrapper>;
}
