import { GetRoundsResponse } from "@/app/api/games/[gameId]/rounds/route";
import { GetGamesResponse } from "@/app/api/games/route";
import { serverFetch } from "@/app/server-fetch";
import { redirect } from "next/navigation";

type Params = Promise<{ gameId: string }>;

export default async function Page({ params }: { params: Params }) {
  const { gameId } = await params;

  const response = await serverFetch(`/api/games/${gameId}/rounds`);

  if (!response.ok) {
    return <p>Error when fetching games</p>;
  }

  const data: GetRoundsResponse = await response.json();

  redirect(`/game/${gameId}/rounds/${data.rounds.at(-1)?.id}/rules`);
}
