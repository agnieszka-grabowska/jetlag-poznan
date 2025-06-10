import { redirect } from "next/navigation";
import { decrypt, encrypt } from "./session";
import { cookies } from "next/headers";

const WEEK_IN_SECONDS = 7 * 24 * 60 * 60;

export async function createAuthCookie(userId: string) {
  const session = await encrypt({ userId });
  const c = await cookies();
  c.set({
    name: "jetlag_session",
    value: session,
    maxAge: WEEK_IN_SECONDS,
    path: "/",
    sameSite: "strict",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
}

export async function validateSession() {
  const c = await cookies();
  const session = c.get("jetlag_session")?.value;
  const sessionPayload = await decrypt(session);

  const userId = sessionPayload?.userId;

  if (!userId) {
    return redirect("/login");
  } else {
    return userId;
  }
}
