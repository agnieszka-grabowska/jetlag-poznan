"use client";

import Spinner from "@/app/ui/components/spinner/spinner";
import { useRouter } from "next/navigation";
import styles from "./RemoveRoundButton.module.css";
import { useDeleteRound } from "@/app/services/mutations";

export default function RemoveRoundButton() {
  const router = useRouter();
  const { trigger, isMutating } = useDeleteRound();

  async function removeRound() {
    trigger().then(() => router.push(`/`));
  }

  return (
    <button className={styles.button} disabled={isMutating} onClick={removeRound}>
      Remove this round {isMutating && <Spinner color="red" />}
    </button>
  );
}
