"use client";

import useUserTeam from "@/app/hooks/use_user_team";
import { useGameContext } from "../components/GameProvider";
import { useRoundContext } from "../components/RoundProvider";

export type QuestionModel = {
  id: string;
  content: string;
  type: string;
  cost: number;
  details: string | null;
  teamId?: string;
  createdAt: Date | null;
  answeredAt?: Date | null;
  answer?: string | null;
  photoUrl?: string | null;
};

export function useSeekerViewQuestions() {
  const { round } = useRoundContext();
  const { game_questions } = useGameContext();
  const { userTeam } = useUserTeam();

  const questions: QuestionModel[] = game_questions
    .map((q): QuestionModel => {
      const questionDetails = round.questions.find(
        (ques) => ques.questionId === q.id && ques.teamId === userTeam.id
      );
      return {
        id: q.id,
        content: q.content,
        type: q.type,
        cost: q.cost,
        details: q.details,
        createdAt: questionDetails?.created_at ?? null,
        answeredAt: questionDetails?.answered_at ?? null,
        answer: questionDetails?.answer ?? null,
        photoUrl: questionDetails?.photo_url ?? null,
      };
    })
    .sort(compareQuestions);

  return { questions };
}

export function useHiderViewQuestions() {
  const { round } = useRoundContext();
  const { game_questions } = useGameContext();

  const questions: QuestionModel[] = round.questions
    .map((q): QuestionModel => {
      const questionDetails = game_questions.find((ques) => ques.id === q.questionId);

      if (!questionDetails) {
        throw Error(`Could not find game question of id ${q.questionId}`);
      }

      return {
        id: questionDetails.id,
        content: questionDetails.content,
        type: questionDetails.type,
        cost: questionDetails.cost,
        details: questionDetails.details,
        teamId: q.teamId,
        createdAt: q.created_at,
        answeredAt: q.answered_at,
        answer: q.answer,
        photoUrl: q.photo_url,
      };
    })
    .sort(compareQuestions);

  return { questions };
}

function compareQuestions(a: QuestionModel, b: QuestionModel) {
  const aIsPending = a.createdAt && !(a.answer || a.photoUrl) ? 1 : 0;
  const bIsPending = b.createdAt && !(b.answer || b.photoUrl) ? 1 : 0;

  if (aIsPending !== bIsPending) {
    return bIsPending - aIsPending;
  }

  const aDate = a.createdAt ? new Date(a.createdAt).getMilliseconds() : 0;
  const bDate = b.createdAt ? new Date(b.createdAt).getMilliseconds() : 0;

  return bDate - aDate;
}
