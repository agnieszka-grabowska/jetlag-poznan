import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { PatchRoundResponse } from "../start/route";

export type StopRoundRequest = {
  winnerTeamId: string;
};

type Params = Promise<{ gameId: string; roundId: string }>;

export async function PATCH(request: Request, { params }: { params: Params }) {
  const userId = await validateSession();
  const { gameId, roundId } = await params;
  const endedAt = new Date();

  const { winnerTeamId } = (await request.json()) as StopRoundRequest;

  const updatedRound = await db.round.update({
    where: {
      id: roundId,
      gameId,
      teams: {
        some: {
          team: {
            members: {
              some: {
                id: userId,
              },
            },
          },
        },
      },
    },
    data: {
      end_time: endedAt,
      winner_id: winnerTeamId,
    },
  });

  return NextResponse.json<PatchRoundResponse>({ round: updatedRound });
}
