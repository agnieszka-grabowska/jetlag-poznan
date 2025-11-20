"use client";

import useSWR from "swr";
import { GamesResponse } from "../api/games/route";
import { GameResponse } from "../api/games/[gameId]/route";
import { RoundResponse } from "../api/games/[gameId]/rounds/[roundId]/route";
import { fetcher } from "./fetcher";
import { GetPendingQuestionsResponse } from "../api/games/[gameId]/rounds/[roundId]/numberOfPendingQuestions/route";
import { GetActiveCursesResponse } from "../api/games/[gameId]/rounds/[roundId]/numberOfActiveCurses/route";
import { GetCursesResponse } from "../api/curses/route";
import { GetQuestionsResponse } from "../api/questions/route";

export function useGames() {
  return useSWR<GamesResponse>("/api/games");
}

export function useGame(id: string) {
  return useSWR<GameResponse>(`/api/games/${id}`);
}

export function useRound({ gameId, roundId }: { gameId: string; roundId: string }) {
  return useSWR<RoundResponse>(`/api/games/${gameId}/rounds/${roundId}`, fetcher, {
    refreshInterval: (latestData) => {
      if (latestData?.winner_id) return 0;
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

export function useCurses() {
  return useSWR<GetCursesResponse>("/api/curses");
}

export function useQuestions() {
  return useSWR<GetQuestionsResponse>("/api/questions");
}
