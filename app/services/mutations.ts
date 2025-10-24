"use client";

import useSWRMutation from "swr/mutation";
import {
  answerQuestion,
  askQuestion,
  createGame,
  createQuestion,
  createRound,
  deleteCurse,
  deleteQuestion,
  deleteRound,
  editQuestion,
  liftCurse,
  login,
  register,
  startRound,
  stopRound,
  throwCurse,
  vetoCurse,
} from "@/app/services/api";
import toast from "react-hot-toast";
import { useGame, useRound } from "./queries";
import { useParams } from "next/navigation";
import { showToast } from "../helpers";

// AUTH

export function useLogin() {
  return useSWRMutation("/api/login", login);
}

export function useRegister() {
  return useSWRMutation("/api/register", register);
}

// GAMES

export function useCreateGame() {
  return useSWRMutation("/api/games", createGame, {
    onError: showToast,
  });
}

// ROUNDS

export function useCreateRound() {
  const { gameId }: { gameId: string } = useParams();
  const { mutate } = useGame(gameId);

  return useSWRMutation(`/api/games/${gameId}/rounds`, createRound, {
    onSuccess: () => mutate(),
    onError: showToast,
  });
}

export function useDeleteRound() {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useGame(params.gameId);

  return useSWRMutation(`/api/games/${params.gameId}/rounds/${params.roundId}`, deleteRound, {
    onSuccess: () => mutate(),
    onError: showToast,
  });
}

export function useStartRound() {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useRound(params);

  return useSWRMutation(`/api/games/${params.gameId}/rounds/${params.roundId}/start`, startRound, {
    onSuccess: () => mutate(),
    onError: showToast,
  });
}

export function useStopRound() {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useRound(params);

  return useSWRMutation(`/api/games/${params.gameId}/rounds/${params.roundId}/stop`, stopRound, {
    onSuccess() {
      mutate();
      toast.success("Congrats! 🎉", { duration: 3000 });
    },
    onError: showToast,
  });
}

// CURSES

export function useDeleteCurse(id: string) {
  return useSWRMutation(`api/curses/${id}`, deleteCurse, {
    onError: showToast,
  });
}

export function useLiftCurse({
  curseId,
  createdAt,
  teamId,
}: {
  curseId: string;
  createdAt: string;
  teamId: string;
}) {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useRound(params);

  return useSWRMutation(
    `/api/games/${params.gameId}/rounds/${params.roundId}/curses/${curseId}/${createdAt}/${teamId}/lift`,
    liftCurse,
    {
      onSuccess: () => mutate(),
    }
  );
}

export function useVetoCurse({ curseId, createdAt }: { curseId: string; createdAt: string }) {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useRound(params);

  return useSWRMutation(
    `/api/games/${params.gameId}/rounds/${params.roundId}/curses/${curseId}/${createdAt}/veto`,
    vetoCurse,
    {
      onSuccess: () => mutate(),
    }
  );
}

export function useThrowCurse({ teamId, difficulty }: { teamId: string; difficulty: number }) {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useRound(params);

  return useSWRMutation(`/api/curses/throw/${teamId}/${difficulty}`, throwCurse, {
    onSuccess: () => mutate(),
  });
}

// QUESTIONS

export function useCreateQuestion() {
  return useSWRMutation(`/api/questions`, createQuestion);
}

export function useEditQuestion(id: string) {
  return useSWRMutation(`/api/questions/${id}`, editQuestion);
}

export function useDeleteQuestion(id: string) {
  return useSWRMutation(`/api/questions/${id}`, deleteQuestion);
}

export function useAskQuestion(id: string) {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useRound(params);

  return useSWRMutation(`/api/questions/ask/${id}`, askQuestion, {
    onError: showToast,
    onSuccess: () => mutate(),
  });
}

export function useAnswerQuestion({
  questionId,
  ownerTeamId,
}: {
  questionId: string;
  ownerTeamId: string;
}) {
  const params: { gameId: string; roundId: string } = useParams();
  const { mutate } = useRound(params);

  return useSWRMutation(
    `/api/games/${params.gameId}/rounds/${params.roundId}/questions/${questionId}/${ownerTeamId}/answer`,
    answerQuestion,
    {
      onError: showToast,
      onSuccess: () => mutate(),
    }
  );
}
