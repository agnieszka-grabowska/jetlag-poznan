"use client";

import CurseItem from "../components/CurseItem/CurseItem";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import { TeamRoundCurse } from "@prisma/client";
import { useRoundContext } from "../components/RoundProvider";

export default function Curses({ teamId }: { teamId?: string }) {
  const { round } = useRoundContext();

  let curses: Array<TeamRoundCurse> = [];

  if (teamId) {
    curses = round.curses.filter((curse) => curse.teamId === teamId);
  } else {
    curses = round.curses;
  }

  if (curses.length === 0) {
    return <p>No curses... yet 😈</p>;
  }

  return (
    <FlexWithGap>
      {curses.map((curse) => {
        return (
          <CurseItem key={`${curse.curseId}_${curse.teamId}_${curse.created_at}`} curse={curse} />
        );
      })}
    </FlexWithGap>
  );
}
