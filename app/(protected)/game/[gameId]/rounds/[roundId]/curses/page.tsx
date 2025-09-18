"use client";
import useUserTeam from "@/app/hooks/use_user_team";
import TeamsSection, { VetoPeriod } from "../components/TeamsSection/TeamsSection";
import Curses from "./Curses";

export default function Page() {
  const { userTeam } = useUserTeam();
  if (userTeam.role === "SEEKER") {
    return (
      <>
        <VetoPeriod teamId={userTeam.id} />
        <Curses />
      </>
    );
  }
  return <TeamsSection />;
}
