"use client";

import { useRoundContext } from "../RoundProvider";

export function useTeamDetails(teamId: string) {
  const { round } = useRoundContext();

  const teamDetails = round.teams.find((team) => team.id === teamId);

  if (!teamDetails) {
    throw Error(`Could not find team of id ${teamId}`);
  }

  return { teamDetails };
}
