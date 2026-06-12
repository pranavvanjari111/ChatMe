import type { ReactNode } from "react";
import styles from "./AnimatedView.module.css";

const AnimatedView = ({ children }: { children: ReactNode }) => {
  return <div className={styles.animate}>{children}</div>;
};

export default AnimatedView;
