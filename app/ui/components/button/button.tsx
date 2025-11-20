import { ComponentProps } from "react";
import styles from "./button.module.css";
import Link from "next/link";

type ButtonProps = ComponentProps<"button">;
type LinkProps = ComponentProps<typeof Link>;

type Props = LinkProps | ButtonProps;

export function Button(props: Props) {
  if ("href" in props) {
    return <Link className={styles.button} {...props} />;
  }

  return <button className={styles.button} {...props} />;
}
