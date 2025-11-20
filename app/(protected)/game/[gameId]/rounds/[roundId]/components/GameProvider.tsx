"use client";

import React, { ReactNode } from "react";
import { GameResponse } from "@/app/api/games/[gameId]/route";
import { useParams } from "next/navigation";
import Spinner from "@/app/ui/components/spinner/spinner";
import Center from "@/app/ui/components/Center/Center";
import GridSkeleton from "./GridSkeleton";
import { useGame } from "@/app/services/queries";

const GameContext = React.createContext<GameResponse | null>(null);

export function useGameContext() {
  const context = React.useContext(GameContext);

  if (!context) {
    throw new Error("No game context!");
  }

  return context;
}

export default function GameProvider({ children }: { children: ReactNode }) {
  const params: { gameId: string; roundId: string } = useParams();

  const { data, isLoading, error } = useGame(params.gameId);

  if (error) {
    return (
      <GridSkeleton>
        <Center>Error when fetching game</Center>
      </GridSkeleton>
    );
  }

  if (isLoading) {
    return (
      <GridSkeleton>
        <Center>
          <Spinner size="24px" />
        </Center>
      </GridSkeleton>
    );
  }

  if (!data) {
    return (
      <GridSkeleton>
        <Center>No game data</Center>
      </GridSkeleton>
    );
  }

  return <GameContext.Provider value={data}>{children}</GameContext.Provider>;
}
