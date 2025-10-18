"use client";

import styles from "./DeleteButton.module.css";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";
import Spinner from "../spinner/spinner";
import { deleteQuestion } from "@/app/lib/questions";
import { deleteCurse } from "@/app/lib/curses";

export function DeleteQuestionButton({ id }: { id: string }) {
  const { trigger, isMutating } = useSWRMutation(id, deleteQuestion);
  return <DeleteButton isDeleting={isMutating} onClick={trigger} />;
}

export function DeleteCurseButton({ id }: { id: string }) {
  const { trigger, isMutating } = useSWRMutation(id, deleteCurse);
  return <DeleteButton isDeleting={isMutating} onClick={trigger} />;
}

interface DeleteButtonProps {
  onClick: () => Promise<unknown>;
  isDeleting: boolean;
}

function DeleteButton({ isDeleting, onClick }: DeleteButtonProps) {
  const router = useRouter();

  function handleDelete() {
    onClick()
      .then(() => router.refresh())
      .catch((reason) => {
        toast.error("Something went wrong!");
      });
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
