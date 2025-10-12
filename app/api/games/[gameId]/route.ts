import { db } from "../../db";
import { NextResponse } from "next/server";
import { Game, Question, Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";

type GameCurse = {
  curseId: string;
  name: string;
  effect: string;
  difficulty: number;
};

export type GetGameResponse = {
  game: Game & { game_curses: Array<GameCurse>; game_questions: Question[]; rounds: Round[] };
};

type Params = Promise<{ gameId: string }>;

export async function GET(_: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId } = await params;

  const game = await db.game.findFirstOrThrow({
    where: {
      id: gameId,
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
    include: {
      game_curses: {
        select: {
          curseId: true,
          difficulty: true,
          curse: {
            select: {
              effect: true,
              name: true,
            },
          },
        },
      },
      game_questions: true,
      rounds: {
        orderBy: {
          start_time: "asc",
        },
      },
    },
  });

  return NextResponse.json<GetGameResponse>({
    game: {
      ...game,
      game_curses: game.game_curses.map((gameCurse): GameCurse => {
        return {
          curseId: gameCurse.curseId,
          difficulty: gameCurse.difficulty,
          effect: gameCurse.curse.effect,
          name: gameCurse.curse.name,
        };
      }),
    },
  });
}

export type DeleteGamesResponse = { game: Game };
export async function DELETE(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId } = await params;
  const game = await db.game.delete({
    where: { id: gameId, ownerId: userId },
  });

  return NextResponse.json<DeleteGamesResponse>({ game });
}
