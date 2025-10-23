"use client";

import styles from "./DeleteButton.module.css";
import { useRouter } from "next/navigation";
import { FaRegTrashCan } from "react-icons/fa6";
import Spinner from "../spinner/spinner";
import { useDeleteCurse, useDeleteQuestion } from "@/app/services/mutations";

export function DeleteQuestionButton({ id }: { id: string }) {
  const { trigger, isMutating } = useDeleteQuestion(id);
  return <DeleteButton isDeleting={isMutating} onClick={trigger} />;
}

export function DeleteCurseButton({ id }: { id: string }) {
  const { trigger, isMutating } = useDeleteCurse(id);
  return <DeleteButton isDeleting={isMutating} onClick={trigger} />;
}

interface DeleteButtonProps {
  onClick: () => Promise<unknown>;
  isDeleting: boolean;
}

function DeleteButton({ isDeleting, onClick }: DeleteButtonProps) {
  const router = useRouter();

  function handleDelete() {
    onClick().then(() => router.refresh());
  }

  return (
    <button
      aria-label="delete"
      onClick={handleDelete}
      disabled={isDeleting}
      className={styles.deleteButton}
    >
      {isDeleting ? <Spinner /> : <FaRegTrashCan size={20} />}
    </button>
  );
}
