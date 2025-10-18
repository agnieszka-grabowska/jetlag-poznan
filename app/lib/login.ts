import { LoginRequest, LoginResponse } from "../api/login/route";
import { fetcherPost } from "../helpers";

export async function login(body: LoginRequest): Promise<LoginResponse> {
  return fetcherPost("/api/login", { body });
}
