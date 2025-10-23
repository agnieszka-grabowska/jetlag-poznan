"use client";

import { useParams } from "next/navigation";
import GameButton from "./GameButton";
import { useStartRound } from "@/app/services/mutations";

export default function StartRoundButton() {
  const params = useParams<{ gameId: string; roundId: string }>();
  const { trigger, isMutating } = useStartRound();

  return (
    <GameButton onClick={trigger} disabled={isMutating}>
      {isMutating ? "Staring Game..." : "Start Game"}
    </GameButton>
  );
}
