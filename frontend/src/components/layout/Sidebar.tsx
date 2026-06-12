import { useState } from "react";
import ChatList from "../sidebar/ChatList";
import styles from "./Sidebar.module.css";
import { MdSearch } from "react-icons/md";

type Props = { onSelectChat: (chat: any) => void };

const Sidebar = ({ onSelectChat }: Props) => {
  const [search, setSearch] = useState("");

  return (
    <div className={styles.sidebar}>
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Messages</span>
        </div>
        <div className={styles.searchWrap}>
          <span className={styles.searchIcon}><MdSearch size={16} /></span>
          <input
            className={styles.search}
            placeholder="Search conversations"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.list}>
        <ChatList onSelectChat={onSelectChat} search={search} />
      </div>
    </div>
  );
};

export default Sidebar;
