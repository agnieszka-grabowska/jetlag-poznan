"use client";

import styles from "./CurseItem.module.css";
import Spinner from "@/app/ui/components/spinner/spinner";
import Center from "@/app/ui/components/Center/Center";
import { useVetoCurse } from "@/app/services/mutations";

interface VetoCurseButtonProps {
  curseId: string;
  createdAt: Date;
}

export default function VetoCurseButton({ curseId, createdAt }: VetoCurseButtonProps) {
  const { trigger, isMutating } = useVetoCurse({
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
