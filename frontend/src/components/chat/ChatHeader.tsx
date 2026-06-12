import styles from "./ChatHeader.module.css";
import { useUser } from "../../context/UserContext";
import { useEffect, useState } from "react";
import { MdCall, MdVideocam, MdArrowBack } from "react-icons/md";
import { useSocket } from "../../context/SocketContext";
import { useCall } from "../../context/CallContext";
import { useWebRTC } from "../../call/useWebRTC";

const ChatHeader = ({ chat, onBack }: any) => {
  const { user } = useUser();
  const { socket } = useSocket();
  const { setActiveCall } = useCall();
  const [typing, setTyping] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  const receiver = chat?.users?.find((u: any) => u._id !== user?._id);
  const receiverId = receiver?._id?.toString();
  const rtc = useWebRTC(socket, user?._id);

  useEffect(() => {
    if (!socket || !receiverId) return;

    const handleOnlineUsers = (users: string[]) => setOnlineUsers(users);

    const handleOnline = (userId: string) => {
      setOnlineUsers((prev) => prev.includes(userId) ? prev : [...prev, userId]);
    };

    const handleOffline = (data: { userId: string } | string) => {
      const userId = typeof data === "string" ? data : data.userId;
      setOnlineUsers((prev) => prev.filter((id) => id !== userId));
    };

    const handleTyping = ({ userId }: any) => { if (userId === receiverId) setTyping(true); };
    const handleStopTyping = ({ userId }: any) => { if (userId === receiverId) setTyping(false); };

    socket.on("online_users", handleOnlineUsers);
    socket.on("user_online", handleOnline);
    socket.on("user_offline", handleOffline);
    socket.on("typing", handleTyping);
    socket.on("stop_typing", handleStopTyping);

    return () => {
      socket.off("online_users", handleOnlineUsers);
      socket.off("user_online", handleOnline);
      socket.off("user_offline", handleOffline);
      socket.off("typing", handleTyping);
      socket.off("stop_typing", handleStopTyping);
    };
  }, [socket, receiverId]);

  const isOnline = receiverId ? onlineUsers.includes(receiverId) : false;

  const getStatus = () => {
    if (typing) return "typing…";
    if (isOnline) return "Online";
    if (receiver?.lastSeen) {
      return `Last seen ${new Date(receiver.lastSeen).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
    }
    return "Offline";
  };

  const handleCall = async (type: "audio" | "video") => {
    if (!socket || !receiverId) return;
    try {
      await rtc.callUser(receiverId, type);
      setActiveCall(type);
    } catch (err) {
      console.error("Call error:", err);
    }
  };

  const name = receiver?.name || receiver?.phoneNumber || "Unknown";

  return (
    <div className={styles.header}>
      {onBack && (
        <button className={styles.back} onClick={onBack} aria-label="Back">
          <MdArrowBack size={20} />
        </button>
      )}

      <div className={styles.avatarWrap}>
        {receiver?.profilePhoto
          ? <img src={receiver.profilePhoto} alt={name} className={styles.avatarImg} />
          : <div className={styles.avatarFallback}>{name.charAt(0).toUpperCase()}</div>
        }
        {isOnline && <span className={styles.onlineDot} />}
      </div>

      <div className={styles.info}>
        <div className={styles.name}>{name}</div>
        <div className={`${styles.status} ${typing ? styles.typing : ""}`}>{getStatus()}</div>
      </div>

      <div className={styles.actions}>
        <button className={styles.callBtn} onClick={() => handleCall("audio")} aria-label="Voice call">
          <MdCall size={19} />
        </button>
        <button className={styles.callBtn} onClick={() => handleCall("video")} aria-label="Video call">
          <MdVideocam size={19} />
        </button>
      </div>
    </div>
  );
};

export default ChatHeader;
