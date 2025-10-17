import { ReactNode } from "react";
import styles from "./ItemFlexWrapper.module.css";

interface ItemFlexWrapperProps {
  children: ReactNode;
}
export default function ItemFlexWrapper({ children }: ItemFlexWrapperProps) {
  return <li className={styles.item}>{children}</li>;
}
