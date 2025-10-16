import styles from "./QuestionItem.module.css";
import Link from "next/link";
import { FaPen } from "react-icons/fa6";
import { Text } from "../text/text";
import { TagProps } from "../tag/tag";
import DeleteQuestionButton from "./DeleteQuestionButton";

interface QuestionItemProps {
  id: string;
  content: string;
  type: string;
  cost: number;
  details: string | null;
}

export default function QuestionItem({ id, content, type, cost, details }: QuestionItemProps) {
  const tags: TagProps[] = [{ children: String(cost) }];
  if (type) {
    tags.push({ children: type, hue: HUES[type] ?? 200 });
  }

  return (
    <li>
      <div>
        <Text type="title" tags={tags}>
          {content}
        </Text>
        {details && <Text type="description">{details}</Text>}
      </div>
      <Link href={`/questions/${id}`} aria-label="edit">
        <FaPen />
      </Link>
      <DeleteQuestionButton questionId={id} />
    </li>
  );
}

const HUES: Record<string, number> = {
  Dziwne: 120,
  Relatywne: 0,
  Radar: 30,
  Zdjęcia: 180,
  Precyzyjne: 240,
  "Tak/Nie": 310,
};
