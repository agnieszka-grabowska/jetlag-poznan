import { RegisterRequest, RegisterResponse } from "../api/register/route";
import { fetcherPost } from "../helpers";

export async function register(body: RegisterRequest): Promise<RegisterResponse> {
  return fetcherPost("/api/register", { body });
}
