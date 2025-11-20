"use client";

import styles from "./RoundsNavigation.module.css";
import Round from "./Round";
import { usePathname } from "next/navigation";
import { useGameContext } from "../GameProvider";

export default function RoundsNavigation() {
  const { rounds } = useGameContext();

  const pathname = usePathname();
  const currectPageIsRules = pathname.endsWith("rules");

  if (!currectPageIsRules) {
    return;
  }

  return (
    <nav>
      <ol className={styles.nav}>
        {rounds.map((round, index) => (
          <Round round={round} key={round.id} index={index} />
        ))}
      </ol>
    </nav>
  );
}
