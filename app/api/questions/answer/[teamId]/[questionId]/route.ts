import { NextResponse } from "next/server";
import { db } from "@/app/api/db";
import { validateSession } from "@/app/api/auth";
import { Question, TeamRoundQuestion } from "@prisma/client";
import { uploadFile } from "@uploadcare/upload-client";

export type AnswerQuestionResponse = {
  question: TeamRoundQuestion & { question: Question };
};

type Params = Promise<{
  questionId: string;
  teamId: string;
}>;

export async function POST(request: Request, { params }: { params: Params }) {
  const userId = await validateSession();
  const { questionId, teamId } = await params;

  const formData = await request.formData();
  const answer = formData.get("answer") as string | null;
  const photo = formData.get("photo") as File | null;

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
        end_time: null,
      },
    },
  });

  if (!photo && !answer) {
    return NextResponse.json(
      {
        error: `Answer was not provided. Include photo or text.`,
      },
      { status: 400 }
    );
  }

  // Upload to Uploadcare
  let result = null;

  if (photo) {
    const publicKey = process.env.UPLOADCARE_PUBLIC_KEY;
    if (!publicKey) {
      throw new Error("UPLOADCARE_PUBLIC_KEY must be set");
    }
    const buffer = Buffer.from(await photo.arrayBuffer());

    result = await uploadFile(buffer, {
      publicKey,
      fileName: photo.name,
      contentType: photo.type,
    });
  }

  const answerResponse = await db.teamRoundQuestion.update({
    where: {
      teamId_questionId_roundId: {
        questionId,
        teamId,
        roundId: lastRound.roundId,
      },
    },
    data: {
      answered_at: new Date(),
      answer,
      photo_url: result?.cdnUrl ?? null,
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
