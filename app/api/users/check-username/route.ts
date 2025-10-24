import { db } from "../../db";
import { NextResponse } from "next/server";
import { validateSession } from "@/app/api/auth";
import { User } from "@prisma/client";

export type UserRequest = { username: string };
export type UserResponse = { user: Omit<User, "password"> };

export async function POST(request: Request) {
  await validateSession();
  const { username } = (await request.json()) as UserRequest;
  const user = await db.user.findFirst({
    where: {
      username,
    },
  });

  if (user === null) {
    return NextResponse.json({ error: `User "${username}" does not exist` }, { status: 400 });
  }

  return NextResponse.json<UserResponse>({
    user: { id: user.id, username: user.username },
  });
}
