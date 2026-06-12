import styles from "./Loader.module.css";

interface LoaderProps {
  show: boolean;
}

export default function Loader({ show }: LoaderProps) {
  if (!show) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.spinner}></div>
    </div>
  );
}
