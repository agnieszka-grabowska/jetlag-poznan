"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/app/ui/components/button/button";
import Form from "@/app/ui/components/Form/Form";
import { JSX } from "react";
import useSWRMutation from "swr/mutation";
import { createQuestion, editQuestion } from "@/app/lib/questions";
import { QuestionRequest } from "@/app/api/questions/questions-types";
import Spinner from "@/app/ui/components/spinner/spinner";

interface CreateQuestion {
  type: "create";
  id?: never;
  initialValues?: never;
}

interface EditQuestion {
  type: "edit";
  id: string;
  initialValues: QuestionRequest;
}

type QuestionFormProps = EditQuestion | CreateQuestion;

export function QuestionForm({ type, id, initialValues }: QuestionFormProps): JSX.Element {
  const fetcher = (_: string, { arg }: { arg: QuestionRequest }) => {
    return type === "create" ? createQuestion(arg) : editQuestion(id, arg);
  };
  const { trigger, isMutating } = useSWRMutation("questions", fetcher);

  const router = useRouter();
  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault();
        const requestBody: QuestionRequest = {
          content: e.currentTarget.content.value,
          cost: parseInt(e.currentTarget.cost.value),
          type: e.currentTarget.type.value,
          details: e.currentTarget.details.value,
        };

        trigger(requestBody).then(() => router.push("/"));
      }}
    >
      <label>
        Content
        <input name="content" defaultValue={initialValues?.content} />
      </label>
      <label>
        Cost
        <input name="cost" type="number" defaultValue={initialValues?.cost} />
      </label>
      <label>
        Type
        <input name="type" defaultValue={initialValues?.type} />
      </label>
      <label>
        Details
        <textarea name="details" defaultValue={initialValues?.details ?? undefined} />
      </label>
      <Button type="submit" disabled={isMutating}>
        {isMutating ? <Spinner /> : type === "create" ? "Create" : "Update"}
      </Button>
    </Form>
  );
}
