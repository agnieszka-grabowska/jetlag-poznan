"use client";

import { useParams } from "next/navigation";
import styles from "./CurseItem.module.css";
import Spinner from "@/app/ui/components/spinner/spinner";
import Center from "@/app/ui/components/Center/Center";
import { useLiftCurse } from "@/app/services/mutations";

export default function LiftCurseButton({
  curseId,
  teamId,
  createdAt,
}: {
  curseId: string;
  teamId: string;
  createdAt: Date;
}) {
  const params: { gameId: string; roundId: string } = useParams();

  const { trigger, isMutating } = useLiftCurse({
    ...params,
    curseId,
    teamId,
    createdAt: String(createdAt),
  });

  function liftCurse() {
    trigger();
  }

  return (
    <button className={styles.liftCurseButton} onClick={liftCurse} disabled={isMutating}>
      <Center> {isMutating ? <Spinner /> : "Mark as DONE!"}</Center>
    </button>
  );
}
