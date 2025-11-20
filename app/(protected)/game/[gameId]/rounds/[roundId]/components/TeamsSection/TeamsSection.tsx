"use client";

import styles from "./TeamsSection.module.css";
import Tag from "@/app/ui/components/tag/tag";
import ThrowCurse from "@/app/ui/throw-curse/throw-curse";
import Curses from "../../curses/Curses";
import { useRoundContext } from "../RoundProvider";
import { formatTime } from "@/app/helpers";
import useVetoCountdown from "../useVetoTime";

export default function TeamsSection() {
  const { teams } = useRoundContext();
  const seekerTeams = teams.filter((team) => team.role === "SEEKER");

  return (
    <div className={styles.teamsWrapper}>
      {seekerTeams.map((team) => (
        <TeamCard key={team.id} teamId={team.id}></TeamCard>
      ))}
    </div>
  );
}

function TeamCard({ teamId }: { teamId: string }) {
  const { teams } = useRoundContext();
  const team = teams.find((team) => team.id === teamId);

  if (!team) {
    throw Error(`Could not find team of id ${teamId}`);
  }

  return (
    <div className={styles.teamWrapper}>
      <div className={styles.teamHeader}>
        {team.name} <Tag>{team.coins.toString()}</Tag>
      </div>
      <ThrowCurse teamId={team.id} coins={team.coins} />
      <VetoPeriod teamId={team.id} />
      <Curses teamId={team.id}></Curses>
    </div>
  );
}

export function VetoPeriod({ teamId }: { teamId: string }) {
  const vetoPeriod = useVetoCountdown(teamId);

  if (vetoPeriod > 0) {
    return <div className={styles.veto}>Veto: {formatTime(vetoPeriod)}</div>;
  }

  return;
}
