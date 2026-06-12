import styles from "./ChatListItem.module.css";
import { useUser } from "../../context/UserContext";

type Props = {
  chat: any;
  onClick: () => void;
};

const ChatListItem = ({ chat, onClick }: Props) => {
  const { user } = useUser();
  const receiver = chat.users?.find((u: any) => u._id !== user?._id);
  const lastMessage = chat.lastMessage;
  const name = receiver?.name || receiver?.phoneNumber || "Unknown";
  const initial = name.charAt(0).toUpperCase();
  const isOnline = receiver?.isOnline;

  const formatTime = (date?: string) => {
    if (!date) return "";
    const d = new Date(date);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  };

  const userId = user?._id?.toString();
  const unreadCount = chat.unreadCounts
    ? (chat.unreadCounts instanceof Map
        ? chat.unreadCounts.get(userId) || 0
        : chat.unreadCounts[userId] || 0)
    : 0;

  return (
    <div className={styles.item} onClick={onClick}>
      <div className={styles.avatarWrap}>
        <div className={styles.avatar}>
          {receiver?.profilePhoto ? (
            <img src={receiver.profilePhoto} alt={name} className={styles.avatarImg} />
          ) : (
            initial
          )}
        </div>
        {isOnline && <span className={styles.onlineDot} />}
      </div>

      <div className={styles.content}>
        <div className={styles.top}>
          <span className={styles.name}>{name}</span>
          <span className={styles.time}>{formatTime(lastMessage?.createdAt)}</span>
        </div>
        <div className={styles.bottom}>
          <span className={styles.msg}>{lastMessage?.content || "No messages yet"}</span>
          {unreadCount > 0 && <span className={styles.unread}>{unreadCount > 99 ? "99+" : unreadCount}</span>}
        </div>
      </div>
    </div>
  );
};

export default ChatListItem;
