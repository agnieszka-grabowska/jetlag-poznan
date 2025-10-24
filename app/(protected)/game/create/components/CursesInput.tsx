import React from "react";
import styles from "../page.module.css";
import { Text } from "@/app/ui/components/text/text";
import FlexWithGap from "@/app/ui/components/FlexWithGap/FlexWithGap";
import ListItemPlaceholder from "@/app/ui/components/ListItemPlaceholder/ListItemPlaceholder";
import { useCurses } from "@/app/services/queries";

export default function CursesInput() {
  const { data, error, isLoading } = useCurses();

  if (error) {
    return <div>Error loading questions</div>;
  }

  if (isLoading) {
    return (
      <ul>
        <ListItemPlaceholder />
        <ListItemPlaceholder />
        <ListItemPlaceholder />
      </ul>
    );
  }

  if (data) {
    return (
      <ul>
        {data.curses.map((curse) => {
          return (
            <li key={curse.id} className={styles.curse}>
              <div className={styles.curseDifficulty}>
                <Text type="description">Difficulty</Text>
                <input
                  type="number"
                  name={`curse`}
                  id={curse.id}
                  min={1}
                  max={3}
                  defaultValue={Math.min(curse.defaultDifficulty ?? 1, 3)}
                />
              </div>
              <FlexWithGap gap={0}>
                <Text type="title">{curse.name}</Text>
                <Text type="description">{curse.effect}</Text>
              </FlexWithGap>
            </li>
          );
        })}
      </ul>
    );
  }
}
