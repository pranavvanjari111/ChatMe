import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";

type Chat = {
  _id: string;
  users: any[];
  participants?: any[];
  lastMessage?: any;
  unreadCounts?: any;
  isGroupChat?: boolean;
};

type ChatContextType = {
  chats: Chat[];
  setChats: (chats: Chat[]) => void;

  selectedChat: Chat | null;
  setSelectedChat: (chat: Chat | null) => void;
};

const ChatContext = createContext<ChatContextType | null>(null);

interface Props {
  children: ReactNode;
}

export const ChatProvider = ({ children }: Props) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);

  return (
    <ChatContext.Provider
      value={{
        chats,
        setChats,
        selectedChat,
        setSelectedChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChats = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChats must be used within ChatProvider");
  }
  return context;
};
