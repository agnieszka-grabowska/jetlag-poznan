import { Text } from "@/app/ui/components/text/text";
import EditButton from "../EditButton/EditButton";
import ItemFlexWrapper from "../ItemFlexWrapper/ItemFlexWrapper";
import { DeleteCurseButton } from "@/app/ui/components/DeleteButton/DeleteButton";

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
      <DeleteCurseButton id={id} />
    </ItemFlexWrapper>
  );
}
