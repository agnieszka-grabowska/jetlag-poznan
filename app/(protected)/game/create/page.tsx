"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { FormEvent } from "react";
import styles from "./page.module.css";
import reducer from "./reducer";
import { PostGamesRequest } from "@/app/api/games/route";
import Form from "@/app/ui/components/Form/Form";
import Spinner from "@/app/ui/components/spinner/spinner";
import QuestionsInput from "./components/QuestionsInput";
import InputWithAddButton from "./components/InputWithAddButton";
import Teams from "./components/Teams";
import CursesInput from "./components/CursesInput";
import { useCheckUsername, useCreateGame } from "@/app/services/mutations";
import toast from "react-hot-toast";

const INITIAL_CURSES_COSTS = [10, 30, 50];

export default function CreateGamePage() {
  const router = useRouter();
  const [teams, dispatch] = React.useReducer(reducer, []);
  const { trigger, isMutating } = useCreateGame();
  const { trigger: triggerUsernameCheck } = useCheckUsername();

  function handleAddTeam(teamName: string) {
    const teamAlreadyExists = teams.some((team) => team.name === teamName);
    if (teamAlreadyExists) {
      toast.error(`There already is team named ${teamName}`);
      return false;
    } else {
      dispatch({ type: "team_added", teamName });
      return true;
    }
  }

  async function handleAddMember(teamName: string, username: string): Promise<boolean> {
    return triggerUsernameCheck({ username })
      .then(({ user }) => {
        dispatch({ type: "member_added", user, teamName });
        return true;
      })
      .catch(() => false);
  }

  function handleRemoveTeam(teamName: string) {
    dispatch({ type: "team_removed", teamName: teamName });
  }

  function handleChangeRole(teamName: string, role: Role) {
    dispatch({ type: "role_set", teamName, role });
  }

  function handleRemoveMember(teamName: string, userId: string) {
    dispatch({ type: "member_removed", teamName, userId });
  }

  function handleSubmitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const name = formData.get("gameName") as string;
    const jailDuration = timeToMiliseconds(formData.get("jailDuration") as string);
    const answerTimeLimit = timeToMiliseconds(formData.get("answerTimeLimit") as string);
    const questionIds = formData.getAll("question") as string[];
    if (questionIds.length === 0) {
      toast.error("Add at least one question to game");
      return;
    }
    const curseCosts = formData.getAll("curseCost").map((cost) => Number(cost));

    const inputsCurse = form.querySelectorAll<HTMLInputElement>("input[name='curse']");
    const curses = Array.from(inputsCurse).map((curse) => ({
      id: curse.id,
      difficulty: Number(curse.value),
    }));

    const requestData: PostGamesRequest = {
      name,
      questionIds,
      teams,
      curses,
      answerTimeLimit,
      jailDuration,
      curse_costs: curseCosts,
    };

    trigger(requestData).then((game) =>
      router.push(`/game/${game.id}/rounds/${game.rounds[0].id}`)
    );
  }

  return (
    <Form onSubmit={handleSubmitForm}>
      <label>
        Game Name
        <input type="text" name="gameName" required />
      </label>

      <label>
        Answer Time Limit
        <input type="time" name="answerTimeLimit" min="00:01" defaultValue="00:15" required />
      </label>

      <label>
        Seekers&apos; Jail Period
        <input type="time" name="jailDuration" min="00:01" defaultValue="00:30" required />
      </label>

      <InputWithAddButton label="Teams" onClick={handleAddTeam} />
      <Teams
        teams={teams}
        removeTeam={handleRemoveTeam}
        changeRole={handleChangeRole}
        addMember={handleAddMember}
        removeMember={handleRemoveMember}
      ></Teams>
      <fieldset>
        <legend>Questions</legend>
        <QuestionsInput />
      </fieldset>

      <fieldset>
        <legend>Curse Costs</legend>
        {INITIAL_CURSES_COSTS.map((cost, index) => (
          <label key={index}>
            Curses of difficulty {index + 1}
            <input type="number" min={1} name="curseCost" defaultValue={cost} />
          </label>
        ))}
      </fieldset>

      <fieldset>
        <legend>Curses</legend>
        <CursesInput />
      </fieldset>
      <button className={styles.createButton} disabled={isMutating}>
        {isMutating ? <Spinner color="gray" /> : "Create"}
      </button>
    </Form>
  );
}

function timeToMiliseconds(time: string): number {
  const hours = Number(time.split(":")[0]);
  const minutes = Number(time.split(":")[1]);

  const miliseconds = 1000 * 60 * minutes + 1000 * 60 * 60 * hours;
  return miliseconds;
}
