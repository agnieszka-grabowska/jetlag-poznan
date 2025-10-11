import { NextResponse } from "next/server";
import { Role, TeamRoundCurse, TeamRoundQuestion } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";

type Member = {
  id: string;
  username: string;
};
export type Team = {
  id: string;
  name: string;
  role: Role;
  coins: number;
  members: Array<Member>;
};

type Round = {
  id: string;
  gameId: string;
  start_time: Date | null;
  end_time: Date | null;
  winner_id: string | null;
  teams: Array<Team>;
  curses: Array<TeamRoundCurse>;
  questions: Array<TeamRoundQuestion>;
};

export type GetRoundResponse = {
  round: Round;
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
      curses: true,
      questions: true,
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
      teams: round.teams.map((team): Team => {
        return {
          id: team.teamId,
          role: team.role,
          coins: team.coins,
          name: team.team.name,
          members: team.team.members,
        };
      }),
    },
  });
}

export type DeleteRoundResponse = { roundId: string };
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

  return NextResponse.json<DeleteRoundResponse>({ roundId });
}
