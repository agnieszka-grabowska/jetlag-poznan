"use client";

import { useParams } from "next/navigation";
import React from "react";
import styles from "./QuestionItem.module.css";
import useCountdown from "@/app/hooks/use-countdown";
import Spinner from "@/app/ui/components/spinner/spinner";
import { sendNotification } from "@/app/utils/actions";
import { useGameContext } from "../GameProvider";
import { useRoundContext } from "../RoundProvider";
import Center from "@/app/ui/components/Center/Center";
import toast from "react-hot-toast";
import { uploadPhoto } from "./uploadPhoto";
import { useAnswerQuestion } from "@/app/services/mutations";

export default function AnswerForm({
  askedAt,
  questionId,
  ownerTeamId,
}: {
  questionId: string;
  askedAt: Date;
  ownerTeamId?: string;
}) {
  const { answer_time_limit } = useGameContext();
  const { round } = useRoundContext();
  const timeLeftToAnswer = useCountdown({
    startTime: askedAt,
    period: answer_time_limit,
  });

  if (round.end_time) {
    return;
  }

  if (timeLeftToAnswer > 0) {
    return <Form questionId={questionId} ownerTeamId={ownerTeamId ?? ""} />;
  }
}

function Form({ ownerTeamId, questionId }: { ownerTeamId: string; questionId: string }) {
  const params: { gameId: string; roundId: string } = useParams();
  const { trigger, isMutating } = useAnswerQuestion({ ownerTeamId, questionId });

  const [photoIsUploading, setPhotoIsUploading] = React.useState(false);

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

    let photoUrl;
    if (photo) {
      try {
        setPhotoIsUploading(true);
        photoUrl = await uploadPhoto(photo);
      } catch (err: unknown) {
        toast.error(err instanceof Error ? err.message : String(err));
        return;
      } finally {
        setPhotoIsUploading(false);
      }
    }

    trigger({ answer, photoUrl }).then(async () => {
      await sendNotification({
        title: `New answer`,
        message: answer ?? "Photo 🏞️",
        targetUsersIds: ownerTeamMembersIds!,
        url: `/game/${params.gameId}/rounds/${params.roundId}/questions`,
      });
    });
  }

  return (
    <form onSubmit={submitAnswer}>
      <input type="text" name="answer" />
      <label>
        Upload photo
        <input type="file" accept="image/*" name="photoUrl" />
      </label>
      <div className={styles.buttons}>
        <button disabled={isMutating || photoIsUploading} type="submit">
          {isMutating || photoIsUploading ? (
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
            trigger({ answer: "Hiders were unable to answer this question" }).then(async () => {
              await sendNotification({
                title: `New answer`,
                message: "Hiders were unable to answer this question",
                targetUsersIds: ownerTeamMembersIds!,
                url: `/game/${params.gameId}/rounds/${params.roundId}/questions`,
              });
            });
          }}
          disabled={isMutating || photoIsUploading}
        >
          Cannot Answer
        </button>
      </div>
    </form>
  );
}
