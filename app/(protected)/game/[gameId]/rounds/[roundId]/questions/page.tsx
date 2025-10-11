"use client";

import useUserTeam from "@/app/hooks/use_user_team";
import { QuestionItem } from "../components/QuestionItem/QuestionItem";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import Center from "@/app/ui/components/Center/Center";
import { QuestionModel, useHiderViewQuestions, useSeekerViewQuestions } from "./useQuestions";

export default function Page() {
  const { userTeam } = useUserTeam();

  if (userTeam.role === "HIDER") {
    return <HiderViewQuestions />;
  }
  return <SeekerViewQuestions />;
}

function SeekerViewQuestions() {
  const { questions } = useSeekerViewQuestions();

  return <Questions questions={questions} />;
}

function HiderViewQuestions() {
  const { questions } = useHiderViewQuestions();

  return <Questions questions={questions} />;
}

function Questions({ questions }: { questions: Array<QuestionModel> }) {
  if (questions.length <= 0) {
    return <Center>No questions yet!</Center>;
  }

  return (
    <FlexWithGap>
      {questions.map((question) => (
        <QuestionItem key={`${question.id}_${question.teamId ?? ""}`} question={question} />
      ))}
    </FlexWithGap>
  );
}
