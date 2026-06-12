import ChatListItem from "./ChatListItem";
import { useChats } from "../../context/ChatContext";
import { useUser } from "../../context/UserContext";

type Props = {
  onSelectChat: (chat: any) => void;
  search?: string;
};

const ChatList = ({ onSelectChat, search = "" }: Props) => {
  const { chats } = useChats();
  const { user } = useUser();

  const filtered = chats.filter((chat) => {
    if (!search) return true;
    const other = chat.users?.find((u: any) => u._id !== user?._id);
    const name = other?.name || other?.phoneNumber || "";
    return name.toLowerCase().includes(search.toLowerCase());
  });

  if (!filtered.length) {
    return (
      <div style={{ padding: "32px 16px", textAlign: "center", color: "var(--text-muted)", fontSize: "14px" }}>
        {search ? "No conversations found" : "No chats yet. Start one!"}
      </div>
    );
  }

  return (
    <>
      {filtered.map((chat) => (
        <ChatListItem key={chat._id} chat={chat} onClick={() => onSelectChat(chat)} />
      ))}
    </>
  );
};

export default ChatList;
