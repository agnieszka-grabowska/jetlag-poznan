import { Text } from "../text/text";
import { TagProps } from "../tag/tag";
import DeleteButton from "@/app/ui/components/DeleteButton/DeleteButton";
import EditButton from "@/app/ui/components/EditButton/EditButton";
import ItemFlexWrapper from "../ItemFlexWrapper/ItemFlexWrapper";

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
    <ItemFlexWrapper>
      <div>
        <Text type="title" tags={tags}>
          {content}
        </Text>
        {details && <Text type="description">{details}</Text>}
      </div>
      <EditButton href={`/questions/${id}`} />
      <DeleteButton url={`/api/questions/${id}`} />
    </ItemFlexWrapper>
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
