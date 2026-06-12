import styles from "./MessageBubble.module.css";
import { MdDone, MdDoneAll } from "react-icons/md";

type Props = {
  text: string;
  mine: boolean;
  status?: "sent" | "delivered" | "read";
  time?: string;
};

const StatusIcon = ({ status }: { status?: string }) => {
  if (status === "read" || status === "delivered") {
    return <MdDoneAll size={14} />;
  }
  if (status === "sent") {
    return <MdDone size={14} />;
  }
  return null;
};

const MessageBubble = ({ text, mine, status, time }: Props) => {
  return (
    <div className={`${styles.wrap} ${mine ? styles.mine : styles.theirs}`}>
      <div className={styles.bubble}>
        <span className={styles.text}>{text}</span>
        <div className={styles.meta}>
          {time && <span className={styles.time}>{time}</span>}
          {mine && (
            <span className={`${styles.statusIcon} ${status === "read" ? styles.read : ""}`}>
              <StatusIcon status={status} />
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
