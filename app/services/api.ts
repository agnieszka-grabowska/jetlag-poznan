import { DeleteCursesResponse } from "../api/curses/[curseId]/route";
import { LiftCurseResponse } from "../api/games/[gameId]/rounds/[roundId]/curses/[curseId]/[createdAt]/[teamId]/lift/route";
import { VetoCurseResponse } from "../api/games/[gameId]/rounds/[roundId]/curses/[curseId]/[createdAt]/veto/route";
import { PatchRoundResponse } from "../api/games/[gameId]/rounds/[roundId]/start/route";
import { StopRoundRequest } from "../api/games/[gameId]/rounds/[roundId]/stop/route";
import { PostRoundResponse } from "../api/games/[gameId]/rounds/create/route";
import { PostGamesRequest, PostGamesResponse } from "../api/games/route";
import { LoginRequest, LoginResponse } from "../api/login/route";
import {
  AnswerQuestionRequest,
  AnswerQuestionResponse,
} from "../api/games/[gameId]/rounds/[roundId]/questions/[questionId]/[teamId]/answer/route";
import { QuestionRequest, QuestionResponse } from "../api/questions/questions-types";
import { RegisterRequest, RegisterResponse } from "../api/register/route";
import { fetcher } from "./fetcher";
import { AskQuestionResponse } from "../api/questions/ask/[questionId]/route";
import { DeleteRoundResponse } from "../api/games/[gameId]/rounds/[roundId]/route";
import { ThrowCurseResponse } from "../api/curses/throw/[targetTeamId]/[difficulty]/route";

// AUTH

export function login(url: string, { arg }: { arg: LoginRequest }): Promise<LoginResponse> {
  return fetcher(url, { arg, method: "POST" });
}

export function register(
  url: string,
  { arg }: { arg: RegisterRequest }
): Promise<RegisterResponse> {
  return fetcher(url, { arg, method: "POST" });
}

// GAMES

export function createGame(
  url: string,
  { arg }: { arg: PostGamesRequest }
): Promise<PostGamesResponse> {
  return fetcher(url, { arg, method: "POST" });
}

// ROUNDS

export function createRound(url: string): Promise<PostRoundResponse> {
  return fetcher(url, { method: "POST" });
}

export function deleteRound(url: string): Promise<DeleteRoundResponse> {
  return fetcher(url, { method: "DELETE" });
}

export function startRound(url: string): Promise<PatchRoundResponse> {
  return fetcher(url, { method: "PATCH" });
}

export function stopRound(
  url: string,
  { arg }: { arg: StopRoundRequest }
): Promise<PatchRoundResponse> {
  return fetcher(url, { arg, method: "PATCH" });
}

// CURSES

export function deleteCurse(url: string): Promise<DeleteCursesResponse> {
  return fetcher(url, { method: "DELETE" });
}

export function liftCurse(url: string): Promise<LiftCurseResponse> {
  return fetcher(url, { method: "POST" });
}

export function vetoCurse(url: string): Promise<VetoCurseResponse> {
  return fetcher(url, { method: "POST" });
}

export function throwCurse(url: string): Promise<ThrowCurseResponse> {
  return fetcher(url, { method: "POST" });
}

// QUESTIONS

export function createQuestion(
  url: string,
  { arg }: { arg: QuestionRequest }
): Promise<QuestionResponse> {
  return fetcher(url, { arg, method: "POST" });
}

export function editQuestion(
  url: string,
  { arg }: { arg: QuestionRequest }
): Promise<QuestionResponse> {
  return fetcher(url, { arg, method: "PUT" });
}

export function deleteQuestion(url: string): Promise<QuestionResponse> {
  return fetcher(url, { method: "DELETE" });
}

export function answerQuestion(
  url: string,
  { arg }: { arg: AnswerQuestionRequest }
): Promise<AnswerQuestionResponse> {
  return fetcher(url, { arg, method: "POST" });
}

export function askQuestion(url: string): Promise<AskQuestionResponse> {
  return fetcher(url, { method: "POST" });
}
