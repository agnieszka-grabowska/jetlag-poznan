"use client";

import { Role } from "@prisma/client";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, FormEvent } from "react";
import styles from "./page.module.css";
import reducer, { GameState } from "./reducer";
import { PostGamesRequest } from "@/app/api/games/route";
import Form from "@/app/ui/components/Form/Form";
import CardError from "@/app/ui/components/card/CardError";
import Spinner from "@/app/ui/components/spinner/spinner";
import QuestionsInput from "./components/QuestionsInput";
import InputWithAddButton from "./components/InputWithAddButton";
import Teams from "./components/Teams";
import CursesInput from "./components/CursesInput";
import { useCreateGame } from "@/app/services/mutations";

const INITIAL_SETTINGS: GameState = {
  teams: [],
  curses: [],
  cursesCosts: [10, 30, 50],
};

export default function CreateGamePage() {
  const router = useRouter();

  const [errorMessage, setErrorMessage] = React.useState<string>("");
  const [game, dispatch] = React.useReducer(reducer, INITIAL_SETTINGS);

  React.useEffect(() => {
    setErrorMessage("");
  }, [game]);

  const { trigger, isMutating, error } = useCreateGame();

  function initializeCurses(curses: { id: string; difficulty: number }[]) {
    dispatch({ type: "curses_initialized", curses });
  }

  function handleAddTeam(teamName: string) {
    if (game.teams.some((team) => team.name === teamName)) {
      setErrorMessage(`There already is team named ${teamName}`);
      return false;
    } else {
      dispatch({ type: "team_added", teamName });
      return true;
    }
  }

  async function handleAddMember(teamName: string, username: string) {
    const response = await fetch(`/api/users/${username}`);

    if (response.ok) {
      const { user } = await response.json();
      dispatch({ type: "member_added", user, teamName });
      return true;
    } else {
      setErrorMessage(response.statusText);
      return false;
    }
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

  function changeCurseDifficulty(curseId: string, difficulty: number) {
    dispatch({ type: "curse_difficulty_changed", curseId, difficulty });
  }

  function handleSubmitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;

    const checkedQuestionsIds = Array.from(
      form.querySelectorAll("input[name='question']:checked")
    ).map((cb) => cb.id);

    const name = form.gameName.value;
    const inputJailDuration: string = form.jailDuration.value;
    const jailHours = Number(inputJailDuration.split(":")[0]);
    const jailMinutes = Number(inputJailDuration.split(":")[1]);

    const jailDuration = 1000 * 60 * jailMinutes + 1000 * 60 * 60 * jailHours;

    const inputAnswerTimeLimit: string = form.answerTimeLimit.value;
    const answerLimitHours = Number(inputAnswerTimeLimit.split(":")[0]);
    const answerLimitMinutes = Number(inputAnswerTimeLimit.split(":")[1]);

    const answerTimeLimit = 1000 * 60 * answerLimitMinutes + 1000 * 60 * 60 * answerLimitHours;

    const requestData: PostGamesRequest = {
      name,
      questionIds: checkedQuestionsIds,
      teams: game.teams,
      curses: game.curses,
      answerTimeLimit,
      jailDuration,
      curse_costs: game.cursesCosts,
    };

    trigger(requestData).then((game) =>
      router.push(`/game/${game.id}/rounds/${game.rounds[0].id}`)
    );
  }

  function handleCurseCostChange(e: ChangeEvent<HTMLInputElement>, curseDifficulty: 1 | 2 | 3) {
    dispatch({
      type: "curse_costs_updated",
      curseDifficulty,
      curseCost: Number(e.target.value),
    });
  }
  return (
    <>
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
          teams={game.teams}
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
          <label>
            Curses of difficulty 1
            <input
              type="number"
              name="curseCost1"
              defaultValue={game.cursesCosts[0]}
              onChange={(e) => handleCurseCostChange(e, 1)}
            />
          </label>
          <label>
            Curses of difficulty 2
            <input
              type="number"
              name="curseCost2"
              defaultValue={game.cursesCosts[1]}
              onChange={(e) => handleCurseCostChange(e, 2)}
            />
          </label>
          <label>
            Curses of difficulty 3
            <input
              type="number"
              name="curseCost3"
              defaultValue={game.cursesCosts[2]}
              onChange={(e) => handleCurseCostChange(e, 3)}
            />
          </label>
        </fieldset>

        <fieldset>
          <legend>Curses</legend>
          <CursesInput
            curses={game.curses}
            changeCurseDifficulty={changeCurseDifficulty}
            initializeCurses={initializeCurses}
          />
        </fieldset>
        <button className={styles.createButton} disabled={isMutating}>
          {isMutating ? <Spinner color="gray" /> : "Create"}
        </button>
      </Form>
      {errorMessage && <CardError>{errorMessage}</CardError>}
      {error && <CardError>{error.message}</CardError>}
    </>
  );
}
