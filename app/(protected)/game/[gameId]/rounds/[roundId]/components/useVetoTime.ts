import { useRoundContext } from "./RoundProvider";
import { useEffect, useState, useMemo } from "react";

export default function useVetoCountdown(teamId: string) {
  const { round } = useRoundContext();

  const team = round.teams.find((team) => team.id === teamId);

  if (!team) {
    return 0;
  }

  const vetoedCurses = team.curses
    .map((curse) => curse.vetoed_at)
    .filter((vetoed_at) => vetoed_at !== null)
    .sort();

  const vetoedDates = useMemo(() => vetoedCurses, vetoedCurses);
  const vetoPeriod = useCountdownSum(vetoedDates);

  return vetoPeriod;
}

const FIFTEEN_MINUTES = 15 * 60 * 1000;

function useCountdownSum(times: Date[]) {
  const [remaining, setRemaining] = useState(0);

  const datesWithCurseTime: Array<Date> = [];

  times.forEach((date, index) => {
    const prevCurseDate = new Date(datesWithCurseTime[index - 1])?.getTime() || 0;
    const currCurseDate = new Date(date).getTime();

    if (prevCurseDate + FIFTEEN_MINUTES > currCurseDate) {
      datesWithCurseTime[index] = new Date(prevCurseDate + FIFTEEN_MINUTES);
    } else {
      datesWithCurseTime[index] = date;
    }
  });

  useEffect(() => {
    const update = () => {
      const now = Date.now();
      let total = 0;

      for (let i = 0; i < datesWithCurseTime.length; i++) {
        const date = datesWithCurseTime[i];
        const startTime = new Date(date).getTime();
        const endTime = startTime + FIFTEEN_MINUTES;
        const diff = endTime - now;

        if (diff > 0) {
          total += diff + datesWithCurseTime.slice(i + 1).length * FIFTEEN_MINUTES;
          break;
        }
      }
      if (total <= 0) {
        clearInterval(interval);
      }
      setRemaining(total);
    };

    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [times]);

  return remaining;
}
