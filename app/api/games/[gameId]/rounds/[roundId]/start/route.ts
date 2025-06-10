import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Round } from "@prisma/client";
import { sendNotification } from "@/app/utils/actions";
import { P } from "vitest/dist/chunks/environment.d.cL3nLXbE.js";

export type PatchRoundResponse = {
  round: Round;
};

type Params = Promise<{ gameId: string; roundId: string }>;
export async function PATCH(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();
  const { gameId, roundId } = await params;
  const startedAt = new Date();

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
      start_time: startedAt,
    },
    include: {
      game: true,
      teams: {
        include: {
          team: {
            include: { members: true },
          },
        },
      },
    },
  });

  if (updatedRound) {
    const playersIds: string[] = updatedRound.teams.flatMap((team) =>
      team.team.members.flatMap((member) => member.id)
    );

    setTimeout(async () => {
      const round = await db.round.findFirst({
        where: {
          id: roundId,
          gameId,
          end_time: null,
        },
      });

      if (round) {
        await sendNotification({
          title: `Jail period is over!`,
          message: "From now on Hiders cannot leave their district",
          targetUsersIds: playersIds,
          url: `/game/${gameId}/rounds/${roundId}`,
        });
      }
    }, updatedRound.game.jail_duration);
  }

  return NextResponse.json<PatchRoundResponse>({ round: updatedRound });
}
