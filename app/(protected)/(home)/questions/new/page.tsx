import { CreateQuestionForm } from "@/app/(protected)/(home)/questions/QuestionForm";
import Card from "@/app/ui/components/card/card";
import { JSX } from "react";

export default function Page(): JSX.Element {
  return (
    <Card title="Create new question">
      <CreateQuestionForm />
    </Card>
  );
}
