"use client";

import styles from "./CurseItem.module.css";
import { Text } from "@/app/ui/components/text/text";
import LiftCurseButton from "./LiftCurseButton";
import VetoCurseButton from "./VetoCurseButton";
import VetoText from "./VetoText";
import useUserTeam from "@/app/hooks/use_user_team";
import { useRoundContext } from "../RoundProvider";
import Item from "@/app/ui/components/Item/Item";
import { TeamRoundCurse } from "@prisma/client";
import { useCurseDetails } from "../useCurseDetails";

export default function CurseItem({ curse }: { curse: TeamRoundCurse }) {
  const { userTeam } = useUserTeam();
  const { round } = useRoundContext();
  const { curseDetails } = useCurseDetails(curse.curseId);

  const curseIsActive = !curse.lifted_at && !curse.vetoed_at;

  const userIsHider = userTeam.role === "HIDER";

  const isTarget = curse.teamId === userTeam.id;

  const targetTeamName = round.teams.find((team) => team.id === curse.teamId)?.name;

  return (
    <Item style={curseIsActive ? "red" : "default"}>
      <div>
        {targetTeamName && !userIsHider && (
          <p className={styles.team} style={{ color: `${isTarget ? "red" : undefined}` }}>
            {isTarget ? "You!" : targetTeamName}
          </p>
        )}
        <div className={styles.nameWrapper}>
          <Text type="title">{curseDetails.name}</Text>
          {!curseIsActive && <p>{curse.lifted_at ? "✅" : "❌"}</p>}
        </div>
        <p className={styles.createdAt}>
          {new Date(curse.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {curseIsActive && (
          <>
            <Text type="description">{curseDetails.effect}</Text>
            {userIsHider && !round.end_time && (
              <LiftCurseButton
                curseId={curse.curseId}
                teamId={curse.teamId}
                createdAt={curse.created_at}
              />
            )}
            {isTarget && !round.end_time && (
              <VetoCurseButton curseId={curse.curseId} createdAt={curse.created_at} />
            )}
          </>
        )}
      </div>
      {curse.vetoed_at && !round.end_time && <VetoText vetoedAt={curse.vetoed_at}></VetoText>}
    </Item>
  );
}
