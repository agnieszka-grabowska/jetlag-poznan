import { NextResponse } from "next/server";
import { Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type GetRoundsResponse = { rounds: Array<Round> };

type Params = Promise<{ gameId: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId } = await params;

  const rounds = await db.round.findMany({
    orderBy: {
      start_time: "asc",
    },
    where: {
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
  });

  return NextResponse.json<GetRoundsResponse>({ rounds });
}
