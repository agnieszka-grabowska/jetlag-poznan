import { Question } from "@prisma/client";

export interface QuestionRequest {
  content: string;
  details: string | undefined | null;
  cost: number;
  type: string;
}

export interface QuestionResponse {
  question: Question;
}
