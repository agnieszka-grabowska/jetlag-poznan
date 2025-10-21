"use client";
import { fetcher, formatTime } from "@/app/helpers";
import GameButton from "./GameButton";
import React from "react";
import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../RoundProvider";
import { useGameContext } from "../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";
import { useSWRConfig } from "swr";
import useSWRMutation from "swr/mutation";
import toast from "react-hot-toast";
import { StopRoundRequest } from "@/app/api/games/[gameId]/rounds/[roundId]/stop/route";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useError } from "@/app/hooks/use-error";

export default function StopRoundButton() {
  const { round } = useRoundContext();
  const { game } = useGameContext();
  const { userTeam } = useUserTeam();
  const { mutate } = useSWRConfig();

  const jailTimeLeft = useCountdown({
    period: game.jail_duration,
    startTime: round.start_time!,
  });

  const { trigger, isMutating, error } = useSWRMutation(
    `/api/games/${round.gameId}/rounds/${round.id}/stop`,
    (key, { arg }: { arg: StopRoundRequest }) => fetcher(key, { arg: arg, method: "PATCH" })
  );

  useError(error);

  async function stopGame() {
    trigger({ winnerTeamId: userTeam.id }).then(() => {
      mutate(`/api/games/${round.gameId}/rounds/${round.id}`);
      toast.success("Congrats! 🎉", { duration: 3000 });
    });
  }

  let buttonText;

  if (jailTimeLeft === null) {
    buttonText = `Jail period: ...`;
  } else if (jailTimeLeft > 0) {
    buttonText = `Jail period: ${formatTime(jailTimeLeft)}`;
  } else {
    buttonText = "Stop Game";
  }

  return (
    <GameButton
      disabled={jailTimeLeft === null || jailTimeLeft > 0 || isMutating}
      onClick={stopGame}
    >
      {isMutating ? <Spinner /> : buttonText}
    </GameButton>
  );
}
