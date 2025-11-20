"use client";

import { useRoundContext } from "../(protected)/game/[gameId]/rounds/[roundId]/components/RoundProvider";
import { useUserContext } from "../(protected)/UserProvider";

export default function useUserTeam() {
  const { id, teams } = useRoundContext();
  const { user } = useUserContext();

  const userTeam = teams.find((team) => team.members.some((memeber) => memeber.id === user.id));

  if (!userTeam) {
    throw Error(`User ${user.username} was not found in round ${id}`);
  }

  return { userTeam };
}
