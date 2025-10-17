import styles from "./EditButton.module.css";
import Link from "next/link";
import { FaRegPenToSquare } from "react-icons/fa6";

interface EditButtonProps {
  href: string;
}

export default function EditButton({ href }: EditButtonProps) {
  return (
    <Link href={href} aria-label="edit" className={styles.editButton}>
      <FaRegPenToSquare size={20} />
    </Link>
  );
}
