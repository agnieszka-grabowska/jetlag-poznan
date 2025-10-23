"use client";

import React from "react";
import styles from "./throw-curse.module.css";
import { Button } from "../components/button/button";
import { useGameContext } from "@/app/(protected)/game/[gameId]/rounds/[roundId]/components/GameProvider";
import Spinner from "../components/spinner/spinner";
import { useThrowCurse } from "@/app/services/mutations";

export default function ThrowCurse({
  teamId,
  coins,
  placeholder,
}: {
  teamId: string;
  coins: number;
  placeholder?: boolean;
}) {
  const [difficulty, setDifficulty] = React.useState<number>(1);
  const { game } = useGameContext();

  const { trigger, isMutating } = useThrowCurse({ difficulty, teamId });

  return (
    <>
      <div className={styles.buttonsWrapper}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (coins < game.curse_costs[difficulty - 1]) {
              alert("Not enough coins to throw a curse");
              return;
            }

            trigger();
          }}
        >
          <select value={difficulty} onChange={(e) => setDifficulty(parseInt(e.target.value))}>
            <option value="1">Easy - {game.curse_costs[0]} coins</option>
            <option value="2">Medium - {game.curse_costs[1]} coins</option>
            <option value="3">Hard - {game.curse_costs[2]} coins</option>
          </select>
          <Button type="submit">{isMutating ? <Spinner /> : "Roll next curse"}</Button>
        </form>
      </div>
    </>
  );
}
