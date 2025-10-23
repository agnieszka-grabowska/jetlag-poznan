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

export type PostRoundResponse = {
  roundId: string;
};

export async function POST(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { gameId } = await params;

  // It's possible to start another game if all rounds of a game are finished
  // Fail if there is an unfinished round in any game
  const unfinishedRound = await db.teamRound.findFirst({
    where: {
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      round: {
        end_time: null,
      },
    },
  });
  if (unfinishedRound) {
    return NextResponse.json({ roundId: unfinishedRound.roundId });
  }

  const previousRounds = await db.round.findMany({
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
    select: {
      end_time: true,
      teams: {
        orderBy: {
          team: {
            name: "asc",
          },
        },
        include: {
          team: {
            select: {
              id: true,
              name: true,
              members: {
                select: {
                  id: true,
                },
              },
            },
          },
        },
      },
    },
  });

  const teams = [...previousRounds[previousRounds.length - 1].teams];
  const nextTeams = teams.map((team, index) => {
    if (index === teams.length - 1) {
      return { ...team, role: teams[0].role };
    }
    return { ...team, role: teams[index + 1].role };
  });

  const round = await db.round.create({
    data: {
      gameId,
      teams: {
        create: nextTeams.map((team) => {
          return {
            role: team.role,
            team: {
              connect: {
                id: team.teamId,
              },
            },
          };
        }),
      },
    },
  });

  return NextResponse.json<PostRoundResponse>({ roundId: round.id });
}
