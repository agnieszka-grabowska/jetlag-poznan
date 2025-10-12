"use client";

import CurseItem from "../components/CurseItem/CurseItem";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import { TeamRoundCurse } from "@prisma/client";
import { useRoundContext } from "../components/RoundProvider";
import useUserTeam from "@/app/hooks/use_user_team";

export default function Curses({ teamId }: { teamId?: string }) {
  const { round } = useRoundContext();
  const { userTeam } = useUserTeam();

  let curses: Array<TeamRoundCurse> = [];

  if (teamId) {
    curses = round.curses.filter((curse) => curse.teamId === teamId);
  } else {
    curses = round.curses;
  }

  if (curses.length === 0) {
    return <p>No curses... yet 😈</p>;
  }

  const activeCursesUserTeam = curses.filter(
    (curse) => !curse.lifted_at && !curse.vetoed_at && curse.teamId === userTeam.id
  );
  const activeCursesOtherTeams = curses.filter(
    (curse) => !curse.lifted_at && !curse.vetoed_at && curse.teamId !== userTeam.id
  );
  const pastCurses = curses.filter((curse) => curse.lifted_at || curse.vetoed_at);

  const sortedCurses = [...activeCursesUserTeam, ...activeCursesOtherTeams, ...pastCurses];
  return (
    <FlexWithGap>
      {sortedCurses.map((curse) => {
        return (
          <CurseItem key={`${curse.curseId}_${curse.teamId}_${curse.created_at}`} curse={curse} />
        );
      })}
    </FlexWithGap>
  );
}
