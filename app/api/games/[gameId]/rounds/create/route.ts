import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";
import { Round } from "@prisma/client";

export type PostRoundResponse = {
  round: Round;
};

type Params = Promise<{ gameId: string }>;

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
    return NextResponse.json(null, {
      statusText: "There is an unfinished round!",
      status: 400,
    });
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

  return NextResponse.json<PostRoundResponse>({ round });
}
