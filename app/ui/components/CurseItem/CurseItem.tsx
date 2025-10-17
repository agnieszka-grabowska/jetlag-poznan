import { Text } from "@/app/ui/components/text/text";
import EditButton from "../EditButton/EditButton";
import DeleteButton from "../DeleteButton/DeleteButton";
import ItemFlexWrapper from "../ItemFlexWrapper/ItemFlexWrapper";

interface CurseItemProps {
  id: string;
  defaultDifficulty: number | null;
  name: string;
  effect: string;
}

export default function CurseItem({ id, defaultDifficulty, name, effect }: CurseItemProps) {
  return (
    <ItemFlexWrapper>
      <div>
        <Text type="title" tags={[{ children: `Difficulty: ${defaultDifficulty}`, hue: 270 }]}>
          {name}
        </Text>
        <Text type="description">{effect}</Text>
      </div>
      <EditButton href={`/curses/${id}`} />
      <DeleteButton url={`/api/curses/${id}`} />
    </ItemFlexWrapper>
  );
}
