import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";

export type GetActiveCursesResponse = { activeCurses: number };

type Params = Promise<{ roundId: string; gameId: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { roundId, gameId } = await params;

  const userTeam = await db.teamRound.findFirstOrThrow({
    where: {
      roundId,
      round: {
        gameId,
      },
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    },
  });

  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  const activeCurses = await db.teamRoundCurse.count({
    where: {
      roundId,
      round: {
        gameId,
      },
      created_at: {
        not: undefined,
      },
      lifted_at: null,
      OR: [{ vetoed_at: null }, { vetoed_at: { gt: fifteenMinutesAgo } }],
      teamId: userTeam.role === "SEEKER" ? userTeam.teamId : { not: undefined },
    },
  });

  return NextResponse.json<GetActiveCursesResponse>({ activeCurses });
}
