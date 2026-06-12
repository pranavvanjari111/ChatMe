import { useEffect, useState, useRef } from "react";
import { getMessages } from "../../services/message.service";
import MessageBubble from "../message/MessageBubble";
import { useUser } from "../../context/UserContext";
import styles from "./ChatMessages.module.css";
import { useSocket } from "../../context/SocketContext";

const ChatMessages = ({ chat }: any) => {
  const [messages, setMessages] = useState<any[]>([]);
  const { user } = useUser();
  const { socket } = useSocket();

  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!socket || !chat?._id) return;

    const handleMessage = (msg: any) => {
      const chatId = typeof msg.chat === "string" ? msg.chat : msg.chat?._id;

      if (chatId === chat._id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    const init = async () => {
      const res = await getMessages(chat._id) as { data: any[] };
      setMessages(res.data);
    };

    init();

    socket.emit("join_chat", chat._id);

    socket.on("new_message", handleMessage);
    socket.on("message_sent", handleMessage);

    socket.emit("message_read", {
      chatId: chat._id,
      userId: user?._id,
    });

    return () => {
      socket.off("new_message", handleMessage);
      socket.off("message_sent", handleMessage);
    };
  }, [socket, chat?._id, user?._id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className={styles.messages}>
      <div className={styles.inner}>
        {messages.map((m) => (
          <MessageBubble
            key={m._id}
            text={m.content}
            mine={m.sender?._id === user?._id}
            status={m.status}
            time={formatTime(m.createdAt)}
          />
        ))}

        <div ref={bottomRef} />
      </div>
    </div>
  );
};

export default ChatMessages;
