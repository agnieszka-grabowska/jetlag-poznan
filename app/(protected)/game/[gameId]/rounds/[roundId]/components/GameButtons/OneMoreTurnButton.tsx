"use client";

import { useParams, useRouter } from "next/navigation";
import GameButton from "./GameButton";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useCreateRound } from "@/app/services/mutations";

export default function OneMoreTurnButton() {
  const params = useParams<{ gameId: string }>();
  const router = useRouter();

  const { trigger, isMutating } = useCreateRound();

  async function createAndGoToNextRound() {
    trigger().then(({ roundId }) => {
      router.push(`/game/${params.gameId}/rounds/${roundId}/rules`);
    });
  }

  return (
    <GameButton onClick={createAndGoToNextRound}>
      {isMutating ? <Spinner /> : "One More Turn!"}
    </GameButton>
  );
}
