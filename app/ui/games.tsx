"use client";

import Link from "next/link";
import { Text } from "./components/text/text";
import { useGames } from "../services/queries";
import Center from "./components/Center/Center";
import Spinner from "./components/spinner/spinner";

export default function Games() {
  const { data, error, isLoading } = useGames();

  if (isLoading) {
    return (
      <Center>
        <Spinner />
      </Center>
    );
  }

  if (error) {
    return <p>Error when fetching games</p>;
  }

  if (!data) {
    return <p>No data</p>;
  }

  return (
    <>
      {data.games.map((game) => (
        <li key={game.id}>
          <Link href={`/game/${game.id}/rounds/${game.rounds.at(-1)?.id}`}>
            <Text type="title" tags={game.isActive ? [{ children: "active", hue: 0 }] : undefined}>
              {game.name}
            </Text>
          </Link>
        </li>
      ))}
    </>
  );
}
