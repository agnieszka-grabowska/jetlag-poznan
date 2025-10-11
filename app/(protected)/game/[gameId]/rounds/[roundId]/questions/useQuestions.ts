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
  const { game } = useGameContext();
  const { userTeam } = useUserTeam();

  const questions: QuestionModel[] = game.game_questions
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
    .sort((a, b) => compareFn(a.createdAt, b.createdAt));

  return { questions };
}

export function useHiderViewQuestions() {
  const { round } = useRoundContext();
  const { game } = useGameContext();

  const questions: QuestionModel[] = round.questions
    .map((q): QuestionModel => {
      const questionDetails = game.game_questions.find((ques) => ques.id === q.questionId);

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
    .sort((a, b) => compareFn(a.createdAt, b.createdAt));

  return { questions };
}

function compareFn(a: Date | null, b: Date | null) {
  const aDate = a ? new Date(a).getMilliseconds() : 0;
  const bDate = b ? new Date(b).getMilliseconds() : 0;

  return bDate - aDate;
}
