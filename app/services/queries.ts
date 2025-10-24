"use client";

import useSWR from "swr";
import { GetGamesResponse } from "../api/games/route";
import { GetGameResponse } from "../api/games/[gameId]/route";
import { GetRoundResponse } from "../api/games/[gameId]/rounds/[roundId]/route";
import { fetcher } from "./fetcher";
import { GetPendingQuestionsResponse } from "../api/games/[gameId]/rounds/[roundId]/numberOfPendingQuestions/route";
import { GetActiveCursesResponse } from "../api/games/[gameId]/rounds/[roundId]/numberOfActiveCurses/route";
import { GetCursesResponse } from "../api/curses/route";
import { GetQuestionsResponse } from "../api/questions/route";

export function useGames() {
  return useSWR<GetGamesResponse>("/api/games");
}

export function useGame(id: string) {
  return useSWR<GetGameResponse>(`/api/games/${id}`);
}

export function useRound({ gameId, roundId }: { gameId: string; roundId: string }) {
  return useSWR<GetRoundResponse>(`/api/games/${gameId}/rounds/${roundId}`, fetcher, {
    refreshInterval: (latestData) => {
      if (latestData?.round.winner_id) return 0;
      return 3000;
    },
  });
}

export function usePendingQuestions({ gameId, roundId }: { gameId: string; roundId: string }) {
  return useSWR<GetPendingQuestionsResponse>(
    `/api/games/${gameId}/rounds/${roundId}/numberOfPendingQuestions`,
    fetcher,
    {
      refreshInterval: 2000,
    }
  );
}

export function useActiveCurses({ gameId, roundId }: { gameId: string; roundId: string }) {
  return useSWR<GetActiveCursesResponse>(
    `/api/games/${gameId}/rounds/${roundId}/numberOfActiveCurses`,
    fetcher,
    {
      refreshInterval: 2000,
    }
  );
}

export function useCurses(onSuccess: (data: GetCursesResponse) => void) {
  return useSWR<GetCursesResponse>("/api/curses", fetcher, { onSuccess });
}

export function useQuestions(onSuccess: (data: GetQuestionsResponse) => void) {
  return useSWR<GetQuestionsResponse>("/api/curses", fetcher, { onSuccess });
}
