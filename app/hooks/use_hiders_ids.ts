import { useRoundContext } from "../(protected)/game/[gameId]/rounds/[roundId]/components/RoundProvider";

export default function useHidersIds() {
  const { teams } = useRoundContext();

  const hidersIds = teams.find((team) => team.role === "HIDER")?.members.map((member) => member.id);

  return { hidersIds };
}
