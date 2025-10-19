import { PostGamesRequest, PostGamesResponse } from "@/app/api/games/route";
import { fetcherPost } from "../helpers";

export async function createGame(
  key: string,
  { arg }: { arg: PostGamesRequest }
): Promise<PostGamesResponse> {
  return fetcherPost(`/api/games`, { arg });
}
