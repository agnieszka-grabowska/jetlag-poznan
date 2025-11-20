"use client";

import useCountdown from "@/app/hooks/use-countdown";
import { useRoundContext } from "../RoundProvider";
import { useGameContext } from "../GameProvider";
import useUserTeam from "@/app/hooks/use_user_team";
import Spinner from "@/app/ui/components/spinner/spinner";
import Center from "@/app/ui/components/Center/Center";
import { useAskQuestion } from "@/app/services/mutations";

export default function AskButton({ questionId }: { questionId: string }) {
  const { userTeam } = useUserTeam();
  const { start_time, end_time } = useRoundContext();

  if (userTeam.role === "HIDER" || !start_time || end_time) {
    return;
  }

  return <Button questionId={questionId} />;
}

function Button({ questionId }: { questionId: string }) {
  const { jail_duration } = useGameContext();
  const { start_time } = useRoundContext();

  const { trigger, isMutating } = useAskQuestion(questionId);

  const jailTimeLeft = useCountdown({
    period: jail_duration,
    startTime: start_time!,
  });

  return (
    <button onClick={() => trigger()} disabled={jailTimeLeft > 0 || isMutating}>
      <Center>{isMutating ? <Spinner /> : "Ask"} </Center>
    </button>
  );
}
