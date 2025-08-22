"use client";

import { useParams } from "next/navigation";
import React from "react";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import useSWRMutation from "swr/mutation";
import Spinner from "@/app/ui/components/spinner/spinner";
import { sendNotification } from "@/app/utils/actions";
import { useGameContext } from "../GameProvider";
import { useRoundContext } from "../RoundProvider";
import { useSWRConfig } from "swr";
import Center from "@/app/ui/components/Center/Center";
import toast from "react-hot-toast";

export default function AnswerForm({
  askedAt,
  questionId,
  ownerTeamId,
}: {
  questionId: string;
  askedAt: Date;
  ownerTeamId?: string;
}) {
  const { game } = useGameContext();
  const { round } = useRoundContext();
  const timeLeftToAnswer = useCountdown({
    startTime: askedAt,
    period: game.answer_time_limit,
  });

  if (round.end_time) {
    return;
  }

  return (
    <>
      {(timeLeftToAnswer ?? 0) > 0 && (
        <Form questionId={questionId} ownerTeamId={ownerTeamId ?? ""} />
      )}
    </>
  );
}

function Form({ ownerTeamId, questionId }: { ownerTeamId: string; questionId: string }) {
  const { mutate } = useSWRConfig();
  const params = useParams();
  const { trigger, isMutating, error } = useSWRMutation<any, Error, any, FormData>(
    `/api/questions/answer/${ownerTeamId}/${questionId}`,
    fetcher
  );
  const { round } = useRoundContext();
  const ownerTeamMembersIds = round.teams
    .find((team) => team.id === ownerTeamId)
    ?.members.map((member) => member.id);

  async function submitAnswer(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const answer: string = event.currentTarget.answer.value;
    const photo: File = event.currentTarget.photoUrl.files[0];

    if (!photo && !answer) {
      toast.error("Your answer can’t be empty. Add text or upload a photo before submitting.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    if (answer) formData.append("answer", answer);
    if (photo) formData.append("photo", photo);

    trigger(formData).then(async () => {
      await sendNotification({
        title: `New answer`,
        message: answer ?? "Photo 🏞️",
        targetUsersIds: ownerTeamMembersIds!,
        url: `/game/${params.gameId}/rounds/${params.roundId}/questions`,
      });
      mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/questions`);
    });
  }

  React.useEffect(() => {
    if (error) {
      toast.error(error?.message ?? "Something went wrong.");
    }
  }, [error]);

  return (
    <form encType="multipart/form-data" onSubmit={submitAnswer}>
      <input type="text" name="answer" />
      <label>
        Upload photo
        <input type="file" accept="image/*" name="photoUrl" />
      </label>
      <div className={styles.buttons}>
        <button disabled={isMutating} type="submit">
          {isMutating ? (
            <Center>
              <Spinner />
            </Center>
          ) : (
            "Answer"
          )}
        </button>
        <button
          type="button"
          onClick={() => {
            const formData = new FormData();
            formData.append("answer", "Hiders were unable to answer this question");

            trigger(formData).then(async () => {
              await sendNotification({
                title: `New answer`,
                message: "Hiders were unable to answer this question",
                targetUsersIds: ownerTeamMembersIds!,
                url: `/game/${params.gameId}/rounds/${params.roundId}/questions`,
              });
              mutate(`/api/games/${params.gameId}/rounds/${params.roundId}/questions`);
            });
          }}
          disabled={isMutating}
        >
          Cannot Answer
        </button>
      </div>
    </form>
  );
}

async function fetcher(url: string, options: { arg: FormData }) {
  const res = await fetch(url, { method: "POST", body: options.arg });
  if (!res.ok) {
    const { error } = await res.json();
    if (error) {
      throw new Error(error);
    }
    throw new Error(res.statusText);
  }
  return await res.json();
}
