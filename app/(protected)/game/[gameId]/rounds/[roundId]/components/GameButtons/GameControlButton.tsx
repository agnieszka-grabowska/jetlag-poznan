"use client";

import { useRoundContext } from "../RoundProvider";
import OneMoreTurnButton from "./OneMoreTurnButton";
import StartRoundButton from "./StartRoundButton";
import StopRoundButton from "./StopRoundButton";
import useUserTeam from "@/app/hooks/use_user_team";

export default function GameControlButton() {
  const { end_time, start_time } = useRoundContext();
  const { userTeam } = useUserTeam();

  if (end_time) return <OneMoreTurnButton />;

  if (!start_time && userTeam.role === "HIDER") return <StartRoundButton />;

  if (start_time && !end_time && userTeam.role === "SEEKER") return <StopRoundButton />;

  return;
}
