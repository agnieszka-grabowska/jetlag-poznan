import { Liveblocks } from "@liveblocks/node";
import { validateSession } from "../auth";
import { db } from "../db";

const secret = process.env.LIVEBLOCKS_SECRET;

if (!secret) {
  throw new Error("LIVEBLOCKS_SECRET must be set");
}

const liveblocks = new Liveblocks({ secret });

export async function POST(request: Request) {
  const userId = await validateSession();

  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      username: true,
    },
  });

  const userGames = await db.game.findMany({
    where: {
      rounds: {
        some: {
          teams: {
            some: {
              team: {
                members: {
                  some: {
                    id: userId,
                  },
                },
              },
            },
          },
        },
      },
    },
    select: {
      id: true,
    },
  });

  const session = liveblocks.prepareSession(userId, { userInfo: { name: user?.username } });

  userGames.forEach((game) => session.allow(`${game.id}`, session.FULL_ACCESS));

  const { status, body } = await session.authorize();
  return new Response(body, { status });
}
