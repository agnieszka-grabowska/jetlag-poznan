import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function POST() {
  const c = await cookies();
  c.delete("jetlag_session");
  return redirect("/login");
}
