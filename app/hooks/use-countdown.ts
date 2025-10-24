"use client";
import React from "react";

export default function useCountdown({ period, startTime }: { period: number; startTime: Date }) {
  const [remainingTime, setRemainingTime] = React.useState(() =>
    getRemainingTime({ period, startTime })
  );

  React.useEffect(() => {
    let intervalId: NodeJS.Timeout;

    const nextRemainingTime = getRemainingTime({ period, startTime });

    if (nextRemainingTime > 0) {
      intervalId = setInterval(() => {
        const n = getRemainingTime({ period, startTime });
        setRemainingTime(n);
        if (n <= 0) {
          clearInterval(intervalId);
        }
      }, 1000);
    } else {
      setRemainingTime(0);
    }

    return () => clearInterval(intervalId);
  }, [period, startTime]);

  return remainingTime;
}

function getRemainingTime({ period, startTime }: { period: number; startTime: Date }) {
  return period - (new Date().getTime() - new Date(startTime).getTime()) + 1000;
}
