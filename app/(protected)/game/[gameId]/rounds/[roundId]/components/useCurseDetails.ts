"use client";

import { useGameContext } from "./GameProvider";

export function useCurseDetails(curseId: string) {
  const { game_curses } = useGameContext();
  const curseDetails = game_curses.find((curse) => curse.curseId === curseId);

  if (!curseDetails) {
    throw Error(`Could not find curse details for curse of id ${curseId}`);
  }

  return { curseDetails };
}
