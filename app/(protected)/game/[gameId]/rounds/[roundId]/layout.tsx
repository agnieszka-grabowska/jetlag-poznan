import styles from "./layout.module.css";
import RoundProvider from "./components/RoundProvider";
import GameProvider from "./components/GameProvider";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";
import RoundsNavigation from "./components/RoundsNavigation/RoundsNavigation";
import { TopNavigation } from "./components/TopNavigation/TopNavigation";
import React from "react";

type Params = Promise<{ gameId: string; roundId: string }>;

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Params;
}) {
  return (
    <div className={styles.grid}>
      <GameProvider>
        <RoundProvider>
          <TopNavigation />
          <RoundsNavigation params={await params} />
          <main className={styles.pageContentWrapper}>{children}</main>
        </RoundProvider>
      </GameProvider>
      <BottomNavigation params={await params} />
    </div>
  );
}
