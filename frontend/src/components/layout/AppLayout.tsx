import LeftNav from "./LeftNav";
import BottomNav from "./BottomNav";
import Sidebar from "./Sidebar";
import ChatScreen from "../chat/ChatScreen";
import ProfilePage from "../../pages/Profile/ProfilePage";
import useBreakpoint from "../../hooks/useBreakpoint";
import styles from "./AppLayout.module.css";
import AnimatedView from "../common/AnimatedView";
import CreateChatPage from "../../pages/Chat/createChat";
import IncomingCall from "../../call/IncomingCall";
import CallScreen from "../../call/CallScreen";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyProfile } from "../../services/user.service";
import { useUser } from "../../context/UserContext";
import Loader from "../Loader";
import { useChats } from "../../context/ChatContext";
import { getUserChats } from "../../services/chatService";
import { MdChatBubbleOutline } from "react-icons/md";

type Screen = "chats" | "status" | "calls" | "profile" | "settings" | "create-chat";

const EmptyChat = () => (
  <div className={styles.empty}>
    <div className={styles.emptyIcon}>
      <MdChatBubbleOutline size={26} />
    </div>
    <span className={styles.emptyLabel}>Select a conversation</span>
  </div>
);

const AppLayout = () => {
  const { setUser } = useUser();
  const { setChats } = useChats();
  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = useState(true);
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [screen, setScreen] = useState<Screen>("chats");
  const [activeChat, setActiveChat] = useState<any | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await getMyProfile();
        setUser(user);
      } catch {
        navigate("/login");
      } finally {
        setLoadingUser(false);
      }
    };
    fetchUser();
  }, [navigate, setUser]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await getUserChats();
        setChats(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchChats();
  }, [setChats]);

  if (loadingUser) return <Loader show />;

  if (isMobile) {
    return (
      <div className={styles.outer}>
        <div className={styles.app} style={{ flexDirection: "column" }}>
          <IncomingCall />
          <CallScreen />
          <div style={{ flex: 1, overflow: "hidden" }}>
            {screen === "chats" && !activeChat && (
              <AnimatedView><Sidebar onSelectChat={setActiveChat} /></AnimatedView>
            )}
            {screen === "chats" && activeChat && (
              <AnimatedView>
                <ChatScreen chat={activeChat} onBack={() => setActiveChat(null)} />
              </AnimatedView>
            )}
            {screen === "profile" && (
              <AnimatedView><ProfilePage onBack={() => setScreen("chats")} /></AnimatedView>
            )}
            {screen === "create-chat" && (
              <AnimatedView><CreateChatPage /></AnimatedView>
            )}
            {(screen === "status" || screen === "calls" || screen === "settings") && (
              <AnimatedView><EmptyChat /></AnimatedView>
            )}
          </div>
          <BottomNav active={screen} onChange={setScreen} />
        </div>
      </div>
    );
  }

  return (
    <div className={styles.outer}>
      <div className={styles.app}>
        <IncomingCall />
        <CallScreen />
        {(isTablet || isDesktop) && (
          <LeftNav active={screen} onChange={setScreen} />
        )}
        {screen === "chats" && (
          <>
            <div className={styles.sidebarPane}>
              <Sidebar onSelectChat={setActiveChat} />
            </div>
            <div className={styles.chatPane}>
              {activeChat ? <ChatScreen chat={activeChat} /> : <EmptyChat />}
            </div>
          </>
        )}
        {screen === "profile" && <ProfilePage onBack={() => setScreen("chats")} />}
        {screen === "create-chat" && <CreateChatPage />}
        {(screen === "status" || screen === "calls" || screen === "settings") && <EmptyChat />}
      </div>
    </div>
  );
};

export default AppLayout;
