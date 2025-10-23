"use client";

import { GetQuestionsResponse } from "@/app/api/questions/route";
import styles from "../page.module.css";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import { Text } from "@/app/ui/components/text/text";
import React from "react";
import { Question } from "@prisma/client";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";
import { useQuestions } from "@/app/services/queries";

export default function QuestionsInput({
  questionIds,
  toggleQuestion,
  initializeQuestions,
}: {
  questionIds: string[];
  toggleQuestion: (questionId: string) => void;
  initializeQuestions: (questionIds: string[]) => void;
}) {
  const onSuccess = (data: GetQuestionsResponse) => {
    if (!questions) {
      initializeQuestions(data.questions.map((question) => question.id));
      setQuestions(data.questions);
    }
  };

  const { error, isLoading } = useQuestions(onSuccess);

  const [questions, setQuestions] = React.useState<Question[] | null>(null);

  if (error) {
    return <div>Error loading questions</div>;
  }

  if (isLoading) {
    return (
      <ul>
        <ListItemPlaceholder />
        <ListItemPlaceholder />
        <ListItemPlaceholder />
      </ul>
    );
  }

  return (
    <>
      {questions &&
        questions.map((question) => {
          return (
            <label key={question.id} className={styles.checkbox} style={{ flexDirection: "row" }}>
              <input
                type="checkbox"
                name="question"
                checked={questionIds.includes(question.id)}
                onChange={() => toggleQuestion(question.id)}
              />
              <FlexWithGap gap={4}>
                <Text type="title" tags={[{ children: question.cost.toString() }]}>
                  {question.content}
                </Text>
                {question.details && <Text type="description">{question.details}</Text>}
              </FlexWithGap>
            </label>
          );
        })}
    </>
  );
}
