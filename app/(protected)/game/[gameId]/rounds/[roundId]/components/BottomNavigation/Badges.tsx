"use client";

import styles from "./BottomNavigation.module.css";
import { useParams } from "next/navigation";
import { useActiveCurses, usePendingQuestions } from "@/app/services/queries";

export function PendingQuestionsBadge() {
  const params: { gameId: string; roundId: string } = useParams();
  const { data } = usePendingQuestions(params);
  if (!data?.pendingQuestions) {
    return;
  }

  return <Badge>{data.pendingQuestions.toString()}</Badge>;
}

export function ActiveCursesBadge() {
  const params: { gameId: string; roundId: string } = useParams();
  const { data } = useActiveCurses(params);

  if (!data?.activeCurses) {
    return;
  }

  return <Badge>{data.activeCurses.toString()}</Badge>;
}

function Badge({ children }: { children: string }) {
  return <div className={styles.badge}>{children}</div>;
}
