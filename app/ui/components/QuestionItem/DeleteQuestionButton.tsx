"use client";

import { fetcherDelete } from "@/app/helpers";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { FaRegTrashCan } from "react-icons/fa6";
import useSWRMutation from "swr/mutation";
import Spinner from "../spinner/spinner";
import { DeleteQuestionsResponse } from "@/app/api/questions/[id]/route";

interface DeleteQuestionButtonProps {
  questionId: string;
}
export default function DeleteQuestionButton({ questionId }: DeleteQuestionButtonProps) {
  const { trigger, isMutating } = useSWRMutation<DeleteQuestionsResponse, any, any, any>(
    `/api/questions/${questionId}`,
    fetcherDelete
  );
  const router = useRouter();

  function handleDelete() {
    trigger()
      .then(() => router.refresh())
      .catch((reason) => {
        toast.error("Something went wrong!");
      });
  }

  return (
    <button aria-label="delete" onClick={handleDelete} disabled={isMutating}>
      {isMutating ? <Spinner /> : <FaRegTrashCan />}
    </button>
  );
}
