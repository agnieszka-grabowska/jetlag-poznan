"use client";

import { useParams } from "next/navigation";
import GameButton from "./GameButton";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import { fetcherPatch } from "@/app/helpers";
import { useError } from "@/app/hooks/use-error";

export default function StartRoundButton() {
  const params = useParams<{ gameId: string; roundId: string }>();
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation(
    `/api/games/${params.gameId}/rounds/${params.roundId}/start`,
    fetcherPatch
  );

  useError(error);

  function startGame() {
    trigger().then(() => {
      mutate(`/api/games/${params.gameId}/rounds/${params.roundId}`);
    });
  }

  return (
    <GameButton onClick={startGame} disabled={isMutating}>
      {isMutating ? "Staring Game..." : "Start Game"}
    </GameButton>
  );
}
