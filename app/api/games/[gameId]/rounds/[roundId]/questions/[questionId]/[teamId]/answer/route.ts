import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Question, TeamRoundQuestion } from "@prisma/client";

export type AnswerQuestionRequest = {
  answer?: string;
  photoUrl?: string;
};

export type AnswerQuestionResponse = {
  question: TeamRoundQuestion & { question: Question };
};

type Params = Promise<{
  gameId: string;
  roundId: string;
  questionId: string;
  teamId: string;
}>;

export async function POST(request: Request, { params }: { params: Params }) {
  const userId = await validateSession();
  const { gameId, roundId, questionId, teamId } = await params;

  const { answer, photoUrl } = (await request.json()) as AnswerQuestionRequest;

  // Throw if the user is not in the target team or not a hider
  const lastRound = await db.teamRound.findFirstOrThrow({
    where: {
      role: "HIDER",
      team: {
        members: {
          some: {
            id: userId,
          },
        },
      },
      round: {
        gameId,
        id: roundId,
        end_time: null,
      },
    },
  });

  if (!photoUrl && !answer) {
    return NextResponse.json(
      {
        error: `Your answer can’t be empty. Add text or upload a photo before submitting.`,
      },
      { status: 400 }
    );
  }

  const answerResponse = await db.teamRoundQuestion.update({
    where: {
      teamId_questionId_roundId: {
        questionId,
        teamId,
        roundId,
      },
    },
    data: {
      answered_at: new Date(),
      answer,
      photo_url: photoUrl,
    },
    include: {
      question: true,
    },
  });

  if (!answerResponse) {
    return NextResponse.json(
      {
        error: `Couldn't find a question ${questionId} for team ${teamId} in active round`,
      },
      { status: 400 }
    );
  }

  const question = await db.question.findFirstOrThrow({
    where: {
      id: questionId,
    },
    select: {
      cost: true,
    },
  });

  if (answer !== "Hiders didn't manage to answer before time ran out") {
    const updatedTeamRound = await db.teamRound.update({
      where: {
        teamId_roundId: {
          teamId,
          roundId: lastRound.roundId,
        },
      },
      data: {
        coins: {
          increment: question.cost,
        },
      },
    });

    if (!updatedTeamRound) {
      return NextResponse.json(
        {
          error: `Couldn't update number of coins`,
        },
        { status: 400 }
      );
    }
  }

  return NextResponse.json<AnswerQuestionResponse>({
    question: answerResponse,
  });
}
