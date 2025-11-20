"use client";

import { formatTime } from "@/app/helpers";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import { useGameContext } from "../GameProvider";
import { useRoundContext } from "../RoundProvider";

export default function TimeLeftToAnswer({ askedAt }: { askedAt: Date }) {
  const { answer_time_limit } = useGameContext();
  const { round } = useRoundContext();

  const timeLeftToAnswer = useCountdown({
    startTime: askedAt,
    period: answer_time_limit,
  });

  if (round.end_time) {
    return;
  }

  return (
    <p className={styles.timeToAnswer}>
      Time left to answer: {formatTime(Math.max(timeLeftToAnswer, 0))}
    </p>
  );
}
