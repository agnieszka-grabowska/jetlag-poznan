import { LoginRequest, LoginResponse } from "../api/login/route";
import { fetcherPost } from "../helpers";

export async function login(_: string, { arg }: { arg: LoginRequest }): Promise<LoginResponse> {
  return fetcherPost("/api/login", { arg });
}
