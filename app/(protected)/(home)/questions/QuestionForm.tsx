"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/app/ui/components/button/button";
import Form from "@/app/ui/components/Form/Form";
import { JSX } from "react";
import { QuestionRequest, QuestionResponse } from "@/app/api/questions/questions-types";
import Spinner from "@/app/ui/components/spinner/spinner";
import { useCreateQuestion, useEditQuestion } from "@/app/services/mutations";

interface EditQuestionFormProps {
  id: string;
  initialValues: QuestionRequest;
}

export function EditQuestionForm({ id, initialValues }: EditQuestionFormProps) {
  const { trigger, isMutating } = useEditQuestion(id);

  return <QuestionForm onSubmit={trigger} isMutating={isMutating} initialValues={initialValues} />;
}

export function CreateQuestionForm() {
  const { trigger, isMutating } = useCreateQuestion();

  return <QuestionForm onSubmit={trigger} isMutating={isMutating} />;
}

interface QuestionFormProps {
  onSubmit: (arg: QuestionRequest) => Promise<QuestionResponse>;
  isMutating: boolean;
  initialValues?: QuestionRequest;
}

function QuestionForm({ onSubmit, isMutating, initialValues }: QuestionFormProps): JSX.Element {
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

        onSubmit(requestBody).then(() => router.push("/"));
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
        {isMutating ? <Spinner /> : initialValues ? "Update" : "Create"}
      </Button>
    </Form>
  );
}
