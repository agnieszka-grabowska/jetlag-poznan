import { NextResponse } from "next/server";
import { Role, Round } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

export type GetRoundResponse = {
  round: Round & {
    teams: { members: { id: string; username: string }[]; name: string; role: Role; id: string }[];
  };
};

type Params = Promise<{ gameId: string; roundId: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId, roundId } = await params;

  const round = await db.round.findFirstOrThrow({
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
    include: {
      teams: {
        orderBy: {
          team: {
            name: "asc",
          },
        },
        include: {
          team: {
            include: {
              members: {
                select: {
                  id: true,
                  username: true,
                },
              },
            },
          },
        },
      },
    },
  });

  return NextResponse.json<GetRoundResponse>({
    round: {
      ...round,
      teams: round.teams.map((team) => {
        return {
          id: team.teamId,
          role: team.role,
          name: team.team.name,
          members: team.team.members,
        };
      }),
    },
  });
}

export type DeleteRoundResponse = { round: Round };
export async function DELETE(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId, roundId } = await params;

  const round = await db.round.delete({
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
  });

  const game = await db.game.findFirst({
    where: {
      id: gameId,
    },
    include: {
      rounds: true,
    },
  });

  if (game) {
    if (game.rounds.length === 0) {
      await db.game.delete({
        where: {
          id: gameId,
        },
      });
    }
  }

  return NextResponse.json<DeleteRoundResponse>({ round });
}
