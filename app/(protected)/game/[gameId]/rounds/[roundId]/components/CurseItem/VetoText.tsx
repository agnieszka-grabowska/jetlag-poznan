import styles from "./TeamCurseItem.module.css";

export default function VetoText({ vetoedAt }: { vetoedAt: Date }) {
  return (
    <p className={styles.vetoText}>
      VETOED at{" "}
      {new Date(vetoedAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>
  );
}
