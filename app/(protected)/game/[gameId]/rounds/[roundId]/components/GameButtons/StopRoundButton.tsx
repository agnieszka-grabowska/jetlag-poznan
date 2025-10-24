"use client";
import { formatTime } from "@/app/helpers";
import GameButton from "./GameButton";
import React from "react";
import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../RoundProvider";
import { useGameContext } from "../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useStopRound } from "@/app/services/mutations";

export default function StopRoundButton() {
  const { round } = useRoundContext();
  const { game } = useGameContext();
  const { userTeam } = useUserTeam();

  const jailTimeLeft = useCountdown({
    period: game.jail_duration,
    startTime: round.start_time!,
  });

  const { trigger, isMutating } = useStopRound();

  const stopGame = () => trigger({ winnerTeamId: userTeam.id });

  let buttonText;

  if (jailTimeLeft > 0) {
    buttonText = `Jail period: ${formatTime(jailTimeLeft)}`;
  } else {
    buttonText = "Stop Game";
  }

  return (
    <GameButton disabled={jailTimeLeft > 0 || isMutating} onClick={stopGame}>
      {isMutating ? <Spinner /> : buttonText}
    </GameButton>
  );
}
