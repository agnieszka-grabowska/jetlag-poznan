import styles from "./QuestionItem.module.css";
import AskButton from "./AskButton";
import React from "react";
import TimeLeftToAnswer from "./TimeLeftToAnswer";
import AnswerForm from "./AnswerForm";
import Item from "@/app/ui/components/Item/Item";
import { Text } from "@/app/ui/components/text/text";
import UploadcareImage from "@uploadcare/nextjs-loader";
import { useTeamDetails } from "./useTeamDetails";
import { QuestionModel } from "../../questions/useQuestions";

export function QuestionItem({ question }: { question: QuestionModel }) {
  const answerIsPending = question.createdAt && !question.answer && !question.photoUrl;

  return (
    <Item style={answerIsPending ? "orange" : undefined}>
      <div className={`${styles.wrapper}`}>
        <div style={{ width: "100%" }}>
          {question.teamId && <AskedBy teamId={question.teamId} />}
          <Text type="title" tags={[{ children: question.cost.toString() }]}>
            {question.content}
          </Text>
          {question.details && <p className={styles.details}>{question.details}</p>}
          {question.answer && <p className={styles.answer}>Answer: {question.answer}</p>}
          {question.photoUrl && (
            <UploadcareImage
              src={question.photoUrl}
              width={300}
              height={200}
              alt="Answer to question"
            />
          )}
          {answerIsPending && <TimeLeftToAnswer askedAt={question.createdAt!} />}
          {answerIsPending && question.teamId !== undefined && (
            <AnswerForm
              askedAt={question.createdAt!}
              ownerTeamId={question.teamId}
              questionId={question.id}
            />
          )}
        </div>
        {!question.answer && !question.photoUrl && !answerIsPending && (
          <AskButton questionId={question.id} />
        )}
      </div>
    </Item>
  );
}

type AskedByProps = { teamId: string };

function AskedBy({ teamId }: AskedByProps) {
  const { teamDetails } = useTeamDetails(teamId);

  return <p className={styles.askedBy}>{teamDetails.name}</p>;
}
