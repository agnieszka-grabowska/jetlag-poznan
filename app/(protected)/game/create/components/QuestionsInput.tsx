"use client";

import styles from "../page.module.css";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import { Text } from "@/app/ui/components/text/text";
import React from "react";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";
import { useQuestions } from "@/app/services/queries";

export default function QuestionsInput() {
  const { data, error, isLoading } = useQuestions();

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
  if (data) {
    return (
      <ul>
        {data.questions.map((question) => {
          return (
            <label key={question.id} className={styles.checkbox} style={{ flexDirection: "row" }}>
              <input type="checkbox" defaultChecked={true} name="question" value={question.id} />
              <FlexWithGap gap={4}>
                <Text type="title" tags={[{ children: question.cost.toString() }]}>
                  {question.content}
                </Text>
                {question.details && <Text type="description">{question.details}</Text>}
              </FlexWithGap>
            </label>
          );
        })}
      </ul>
    );
  }
}
