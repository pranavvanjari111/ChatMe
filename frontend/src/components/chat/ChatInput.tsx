import { useState, useRef, useEffect } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./ChatInput.module.css";
import { useSocket } from "../../context/SocketContext";
import { MdSend } from "react-icons/md";

const ChatInput = ({ chat }: any) => {
  const [text, setText] = useState("");
  const { user } = useUser();
  const { socket } = useSocket();
  const typingTimeout = useRef<any>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (!socket || !text.trim() || !chat?._id) return;
    socket.emit("send_message", { chatId: chat._id, senderId: user?._id, content: text.trim() });
    socket.emit("stop_typing", { chatId: chat._id, userId: user?._id });
    setText("");
    if (inputRef.current) inputRef.current.style.height = "auto";
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = Math.min(e.target.scrollHeight, 120) + "px";

    if (!socket || !chat?._id || !user?._id) return;
    socket.emit("typing", { chatId: chat._id, userId: user._id });
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    typingTimeout.current = setTimeout(() => {
      socket.emit("stop_typing", { chatId: chat._id, userId: user._id });
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  useEffect(() => () => { if (typingTimeout.current) clearTimeout(typingTimeout.current); }, []);

  return (
    <div className={styles.inputContainer}>
      <textarea
        ref={inputRef}
        className={styles.input}
        value={text}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        placeholder="Type a message"
        rows={1}
      />
      <button className={styles.send} onClick={handleSend} disabled={!text.trim()} aria-label="Send">
        <MdSend size={17} />
      </button>
    </div>
  );
};

export default ChatInput;
