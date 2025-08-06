import { NextResponse } from "next/server";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { Team, TeamRound } from "@prisma/client";

export type GetTeamResponse = { team: Team & TeamRound };

type Params = Promise<{ gameId: string; roundId: string; teamId: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  await validateSession();
  const { gameId, roundId, teamId } = await params;

  const team = await db.teamRound.findFirstOrThrow({
    where: {
      roundId,
      round: {
        gameId,
      },
      teamId,
    },
    include: {
      team: true,
    },
  });

  return NextResponse.json<GetTeamResponse>({
    team: { ...team, ...team.team },
  });
}
