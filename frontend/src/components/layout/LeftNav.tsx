import {
  MdChatBubbleOutline,
  MdCall,
  MdSettings,
  MdPersonAdd,
} from "react-icons/md";
import { RiContactsLine } from "react-icons/ri";
import { LuCircleDot } from "react-icons/lu";
import { TbMessage2 } from "react-icons/tb";
import styles from "./LeftNav.module.css";

type Nav = "chats" | "status" | "calls" | "profile" | "settings" | "create-chat";
type Props = { active: Nav; onChange: (nav: Nav) => void };

const topItems = [
  { id: "chats" as Nav,       Icon: MdChatBubbleOutline, label: "Chats" },
  { id: "status" as Nav,      Icon: LuCircleDot,         label: "Status" },
  { id: "calls" as Nav,       Icon: MdCall,              label: "Calls" },
  { id: "create-chat" as Nav, Icon: MdPersonAdd,         label: "New chat" },
];

const bottomItems = [
  { id: "profile" as Nav,  Icon: RiContactsLine, label: "Profile" },
  { id: "settings" as Nav, Icon: MdSettings,     label: "Settings" },
];

const LeftNav = ({ active, onChange }: Props) => (
  <div className={styles.nav}>
    <div className={styles.logoWrap}>
      <TbMessage2 size={20} strokeWidth={2.2} />
    </div>

    <div className={styles.top}>
      {topItems.map(({ id, Icon, label }) => (
        <div
          key={id}
          className={`${styles.icon} ${active === id ? styles.active : ""}`}
          onClick={() => onChange(id)}
          title={label}
        >
          <Icon size={20} />
        </div>
      ))}
    </div>

    <div className={styles.bottom}>
      {bottomItems.map(({ id, Icon, label }) => (
        <div
          key={id}
          className={`${styles.icon} ${active === id ? styles.active : ""}`}
          onClick={() => onChange(id)}
          title={label}
        >
          <Icon size={20} />
        </div>
      ))}
    </div>
  </div>
);

export default LeftNav;
