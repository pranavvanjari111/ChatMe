import type { ReactNode } from "react";
import styles from "./Auth.module.css";

interface Props {
  children: ReactNode;
}

const AuthLayout = ({ children }: Props) => {
  return (
    <div className={styles.layout}>
      {children}
    </div>
  );
};

export default AuthLayout;
