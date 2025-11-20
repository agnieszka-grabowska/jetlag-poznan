"use client";

import { useRoundContext } from "../RoundProvider";

export function useTeamDetails(teamId: string) {
  const { teams } = useRoundContext();

  const teamDetails = teams.find((team) => team.id === teamId);

  if (!teamDetails) {
    throw Error(`Could not find team of id ${teamId}`);
  }

  return { teamDetails };
}
