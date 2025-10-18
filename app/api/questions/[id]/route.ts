import { Question } from "@prisma/client";
import { validateSession } from "@/app/api/auth";
import { db } from "@/app/api/db";
import { NextResponse } from "next/server";
import { QuestionRequest } from "../questions-types";

type Params = Promise<{ id: string }>;
export type PutQuestionsResponse = { question: Question };
export async function PUT(request: Request, { params }: { params: Params }) {
  const userId = await validateSession();
  const { id } = await params;
  const { content, details, cost, type } = (await request.json()) as QuestionRequest;

  const updatedQuestion = await db.question.update({
    where: {
      id,
      ownerId: userId,
    },
    data: {
      content,
      details,
      cost,
      type,
    },
  });

  return NextResponse.json<PutQuestionsResponse>({ question: updatedQuestion });
}

export type DeleteQuestionsResponse = { question: Question };
export async function DELETE(_request: Request, { params }: { params: Params }) {
  const userId = await validateSession();
  const { id } = await params;

  const deletedQuestion = await db.question.delete({
    where: {
      id,
      ownerId: userId,
    },
  });

  return NextResponse.json<DeleteQuestionsResponse>({
    question: deletedQuestion,
  });
}
