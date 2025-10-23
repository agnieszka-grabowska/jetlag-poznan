"use client";

import { useParams } from "next/navigation";
import styles from "./CurseItem.module.css";
import Spinner from "@/app/ui/components/spinner/spinner";
import Center from "@/app/ui/components/Center/Center";
import { useVetoCurse } from "@/app/services/mutations";

interface VetoCurseButtonProps {
  curseId: string;
  createdAt: Date;
}

export default function VetoCurseButton({ curseId, createdAt }: VetoCurseButtonProps) {
  const params: { gameId: string; roundId: string } = useParams();

  const { trigger, isMutating } = useVetoCurse({
    ...params,
    createdAt: String(createdAt),
    curseId,
  });

  const vetoCurse = () => trigger();

  return (
    <button className={styles.vetoCurseButton} onClick={vetoCurse} disabled={isMutating}>
      <Center>{isMutating ? <Spinner /> : "Veto"}</Center>
    </button>
  );
}
