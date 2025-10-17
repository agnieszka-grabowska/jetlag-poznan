import { GetCursesResponse } from "@/app/api/curses/route";
import { serverFetch } from "@/app/server-fetch";
import { JSX } from "react";
import CurseItem from "@/app/ui/components/CurseItem/CurseItem";

export async function Curses(): Promise<JSX.Element> {
  const response = await serverFetch("/api/curses");

  if (!response.ok) {
    return <p>Error questions</p>;
  }

  const data: GetCursesResponse = await response.json();

  return (
    <>
      {data.curses.map((curse) => (
        <CurseItem
          key={curse.id}
          defaultDifficulty={curse.defaultDifficulty}
          effect={curse.effect}
          id={curse.id}
          name={curse.name}
        />
      ))}
    </>
  );
}
