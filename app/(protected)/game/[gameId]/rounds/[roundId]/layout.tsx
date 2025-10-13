import styles from "./layout.module.css";
import RoundProvider from "./components/RoundProvider";
import GameProvider from "./components/GameProvider";
import BottomNavigation from "./components/BottomNavigation/BottomNavigation";
import RoundsNavigation from "./components/RoundsNavigation/RoundsNavigation";
import { TopNavigation } from "./components/TopNavigation/TopNavigation";
import React from "react";
import { Room } from "@/app/Room";
import UserLocationProvider from "./components/UserLocationProvider";

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
        <Room>
          <UserLocationProvider>
            <RoundProvider>
              <TopNavigation />
              <RoundsNavigation />
              <main style={{ overflow: "auto" }}>{children}</main>
            </RoundProvider>
          </UserLocationProvider>
        </Room>
      </GameProvider>
      <BottomNavigation params={await params} />
    </div>
  );
}
