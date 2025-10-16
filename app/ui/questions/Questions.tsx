import { serverFetch } from "@/app/server-fetch";
import { JSX } from "react";
import { Question } from "@prisma/client";
import QuestionItem from "../components/QuestionItem/QuestionItem";

export async function Questions(): Promise<JSX.Element> {
  const response = await serverFetch(`/api/questions`);

  if (!response.ok) {
    return <p>Error questions</p>;
  }

  const data = await response.json();
  return (
    <>
      {data.questions.map((question: Question) => {
        return (
          <QuestionItem
            key={question.id}
            content={question.content}
            cost={question.cost}
            details={question.details}
            id={question.id}
            type={question.type}
          />
        );
      })}
    </>
  );
}
