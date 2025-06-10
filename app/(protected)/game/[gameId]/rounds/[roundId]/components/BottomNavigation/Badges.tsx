"use client";

import styles from "./BottomNavigation.module.css";
import useSWR from "swr";
import { GetPendingQuestionsResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/numberOfPendingQuestions/route";
import { GetActiveCursesResponse } from "@/app/api/games/[gameId]/rounds/[roundId]/numberOfActiveCurses/route";
import { fetcher } from "@/app/helpers";
import { useParams } from "next/navigation";

export function PendingQuestionsBadge() {
  const params: { gameId: string; roundId: string } = useParams();
  const { data } = useSWR<GetPendingQuestionsResponse, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}/numberOfPendingQuestions`,
    fetcher,
    { refreshInterval: 2000 }
  );

  if (!data?.pendingQuestions) {
    return;
  }

  return <Badge>{data.pendingQuestions.toString()}</Badge>;
}

export function ActiveCursesBadge() {
  const params: { gameId: string; roundId: string } = useParams();
  const { data } = useSWR<GetActiveCursesResponse, any, any, any>(
    `/api/games/${params.gameId}/rounds/${params.roundId}/numberOfActiveCurses`,
    fetcher,
    { refreshInterval: 2000 }
  );

  if (!data?.activeCurses) {
    return;
  }

  return <Badge>{data.activeCurses.toString()}</Badge>;
}

function Badge({ children }: { children: string }) {
  return <div className={styles.badge}>{children}</div>;
}
