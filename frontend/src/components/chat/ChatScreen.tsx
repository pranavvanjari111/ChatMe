import ChatHeader from "./ChatHeader";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import styles from "./ChatScreen.module.css";

const ChatScreen = ({ chat, onBack }: any) => {
  return (
    <div className={styles.screen}>
      <ChatHeader chat={chat} onBack={onBack} />
      <ChatMessages chat={chat} />
      <ChatInput chat={chat} />
    </div>
  );
};

export default ChatScreen;
