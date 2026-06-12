import ChatHeader from "../chat/ChatHeader";
import ChatMessages from "../chat/ChatMessages";
import ChatInput from "../chat/ChatInput";
import styles from "./ChatWindow.module.css";

type Props = {
  chat: any;
  onBack?: () => void;
};

export const ChatWindow = ({ chat, onBack }: Props) => {
  if (!chat) {
    return <div className={styles.empty}>Select a chat</div>;
  }

  return (
    <div className={styles.chat}>
      <ChatHeader chat={chat} onBack={onBack} />
      <ChatMessages chat={chat} />
      <ChatInput chat={chat} />
    </div>
  );
};
