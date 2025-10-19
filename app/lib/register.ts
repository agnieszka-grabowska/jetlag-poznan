import { RegisterRequest, RegisterResponse } from "../api/register/route";
import { fetcherPost } from "../helpers";

export async function register(
  _: string,
  { arg }: { arg: RegisterRequest }
): Promise<RegisterResponse> {
  return fetcherPost("/api/register", { arg });
}
