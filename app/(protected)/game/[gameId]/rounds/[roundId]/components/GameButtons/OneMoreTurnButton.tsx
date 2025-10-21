"use client";

import { useParams, useRouter } from "next/navigation";
import { PostRoundResponse } from "@/app/api/games/[gameId]/rounds/create/route";
import GameButton from "./GameButton";
import useSWRMutation from "swr/mutation";
import { fetcherPost } from "@/app/helpers";
import { useError } from "@/app/hooks/use-error";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useSWRConfig } from "swr";

export default function OneMoreTurnButton() {
  const params = useParams<{ gameId: string }>();
  const router = useRouter();
  const { mutate } = useSWRConfig();

  const { trigger, isMutating, error } = useSWRMutation<PostRoundResponse>(
    `/api/games/${params.gameId}/rounds/create`,
    fetcherPost
  );

  useError(error);

  async function createAndGoToNextRound() {
    trigger().then(({ roundId }) => {
      mutate(`/api/games/${params.gameId}`);
      router.push(`/game/${params.gameId}/rounds/${roundId}/rules`);
    });
  }

  return (
    <GameButton onClick={createAndGoToNextRound}>
      {isMutating ? <Spinner /> : "One More Turn!"}
    </GameButton>
  );
}
