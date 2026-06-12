import {
  MdChatBubbleOutline,
  MdCall,
  MdSettings,
  MdPersonOutline,
} from "react-icons/md";
import { LuCircleDot } from "react-icons/lu";
import styles from "./BottomNav.module.css";

type Nav = "chats" | "status" | "calls" | "profile" | "settings" | "create-chat";
type Props = { active: Nav; onChange: (nav: Nav) => void };

const items = [
  { id: "chats" as Nav,   label: "Chats",    Icon: MdChatBubbleOutline },
  { id: "status" as Nav,  label: "Status",   Icon: LuCircleDot },
  { id: "calls" as Nav,   label: "Calls",    Icon: MdCall },
  { id: "profile" as Nav, label: "Profile",  Icon: MdPersonOutline },
  { id: "settings" as Nav,label: "Settings", Icon: MdSettings },
];

const BottomNav = ({ active, onChange }: Props) => (
  <div className={styles.nav}>
    {items.map(({ id, label, Icon }) => (
      <div
        key={id}
        className={`${styles.item} ${active === id ? styles.active : ""}`}
        onClick={() => onChange(id)}
      >
        <span className={styles.iconWrap}><Icon /></span>
        <span>{label}</span>
      </div>
    ))}
  </div>
);

export default BottomNav;
