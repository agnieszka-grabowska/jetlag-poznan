import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "./RoundProvider";

const FIFTEEN_MINUTES = 15 * 60 * 1000;

export default function useVetoCountdown(teamId: string): number {
  const { round } = useRoundContext();

  const team = round.teams.find((team) => team.id === teamId);

  if (!team) {
    throw Error(`Team with id ${teamId} not found`);
  }

  const vetoedCurses = team.curses
    .map((curse) => curse.vetoed_at)
    .filter((vetoed_at) => vetoed_at !== null)
    .sort();

  const scheduledCurses: Array<Date> = [];

  vetoedCurses.forEach((date, index) => {
    const prevCurseDate = new Date(scheduledCurses[index - 1])?.getTime() || 0;
    const currCurseDate = new Date(date).getTime();

    if (prevCurseDate + FIFTEEN_MINUTES > currCurseDate) {
      scheduledCurses[index] = new Date(prevCurseDate + FIFTEEN_MINUTES);
    } else {
      scheduledCurses[index] = date;
    }
  });

  const now = Date.now();
  const lastCurse = scheduledCurses.at(-1);
  const startTime = new Date(lastCurse || 0).getTime();
  const endTime = startTime + FIFTEEN_MINUTES;
  const vetoTimeLeft = endTime - now;

  const vetoPeriod = useCountdown({
    period: vetoTimeLeft,
    startTime: new Date(),
  });

  return vetoPeriod || 0;
}
