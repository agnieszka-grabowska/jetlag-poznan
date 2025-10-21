import { ReactNode } from "react";
import styles from "./GameButton.module.css";

type Props = {
  children: ReactNode;
  onClick: () => void;
  disabled?: boolean;
};

export default function GameButton({ children, onClick, disabled }: Props) {
  return (
    <button className={styles.button} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
}
