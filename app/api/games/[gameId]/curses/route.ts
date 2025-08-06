import { NextResponse } from "next/server";
import { Curse, GameCurse, Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type GetGameCursesResponse = { curses: Array<GameCurse & { curse: Curse }> };

type Params = Promise<{ gameId: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId } = await params;

  const curses = await db.gameCurse.findMany({
    orderBy: {
      difficulty: "asc",
    },
    where: {
      gameId,
      game: {
        rounds: {
          some: {
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
        },
      },
    },
    include: {
      curse: true,
    },
  });

  return NextResponse.json<GetGameCursesResponse>({ curses });
}
