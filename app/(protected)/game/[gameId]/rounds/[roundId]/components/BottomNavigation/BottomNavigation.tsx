import styles from "./BottomNavigation.module.css";
import { FaHouse, FaMeteor, FaRectangleList, FaAlignLeft, FaMapLocation } from "react-icons/fa6";
import { ActiveCursesBadge, PendingQuestionsBadge } from "./Badges";
import NavItem from "./NavItem";
import { IconType } from "react-icons";
import { JSX } from "react";

type NavItemModel = {
  id: string;
  icon: IconType;
  href?: string;
  badge?: JSX.Element;
};

const NAV_ITEMS: Array<NavItemModel> = [
  { id: "home", icon: FaHouse, href: "/" },
  {
    id: "questions",
    icon: FaRectangleList,
    badge: <PendingQuestionsBadge />,
  },
  { id: "curses", icon: FaMeteor, badge: <ActiveCursesBadge /> },
  { id: "map", icon: FaMapLocation },
  { id: "rules", icon: FaAlignLeft },
];

export default function BottomNavigation({
  params,
}: {
  params: { gameId: string; roundId: string };
}) {
  const iconSize = "24px";
  return (
    <nav className={styles.nav}>
      {NAV_ITEMS.map((item) => (
        <NavItem
          key={item.id}
          href={item.href ?? `/game/${params.gameId}/rounds/${params.roundId}/${item.id}`}
          icon={<item.icon size={iconSize} />}
          badge={item.badge}
        >
          {item.id}
        </NavItem>
      ))}
    </nav>
  );
}
