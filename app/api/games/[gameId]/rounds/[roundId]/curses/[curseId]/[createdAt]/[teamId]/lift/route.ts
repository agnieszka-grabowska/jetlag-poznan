import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { TeamRoundCurse } from "@prisma/client";

export type LiftCurseResponse = {
  curse: TeamRoundCurse;
};

type Params = Promise<{
  gameId: string;
  roundId: string;
  curseId: string;
  createdAt: string;
  teamId: string;
}>;

export async function POST(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId, roundId, curseId, createdAt, teamId } = await params;

  // Throw if the user is not in the target team or not a hider
  await db.teamRound.findFirstOrThrow({
    where: {
      role: "HIDER",
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      roundId,
      round: {
        end_time: null,
        gameId,
      },
    },
  });

  const curse = await db.teamRoundCurse.update({
    where: {
      roundId_curseId_teamId_created_at: {
        curseId,
        teamId,
        roundId,
        created_at: createdAt,
      },
    },
    data: {
      lifted_at: new Date(),
    },
  });

  if (!curse) {
    return NextResponse.json(
      {
        error: `No curse with id ${curseId} on team ${teamId} found for active round`,
      },
      { status: 400 }
    );
  }

  return NextResponse.json<LiftCurseResponse>({
    curse,
  });
}
