import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";

export type GetPendingQuestionsResponse = { pendingQuestions: number };

type Params = Promise<{ roundId: string; gameId: string }>;

export async function GET(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();

  const { roundId, gameId } = await params;
  const userTeam = await db.teamRound.findFirstOrThrow({
    where: {
      roundId,
      round: {
        gameId,
      },
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
    },
  });

  const pendingQuestions = await db.teamRoundQuestion.count({
    where: {
      roundId,
      round: {
        gameId,
      },
      created_at: {
        not: undefined,
      },
      answer: null,
      teamId: userTeam.role === "SEEKER" ? userTeam.teamId : { not: undefined },
    },
  });

  return NextResponse.json<GetPendingQuestionsResponse>({ pendingQuestions });
}
