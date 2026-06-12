import { useState } from "react";
import styles from "./CreateChatPage.module.css";
import { createChat } from "../../services/chatService";
import { useChats } from "../../context/ChatContext";

export default function CreateChatPage() {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { chats, setChats } = useChats();

  const handleCreate = async () => {
    setError(""); setSuccess("");
    if (!phoneNumber.trim()) { setError("Please enter a phone number"); return; }
    if (!/^[0-9]{10}$/.test(phoneNumber)) { setError("Enter a valid 10-digit phone number"); return; }
    try {
      setLoading(true);
      const res = await createChat(phoneNumber);
      setChats([res.data, ...chats]);
      setSuccess("Chat started successfully!");
      setPhoneNumber("");
    } catch (err: any) {
      setError(err.message || "Failed to start chat");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.title}>New Conversation</div>
        <div className={styles.subtitle}>Enter someone's phone number to start chatting</div>
      </div>
      <div className={styles.body}>
        <div>
          <label className={styles.label}>Phone Number</label>
          <input
            className={styles.input}
            type="tel"
            placeholder="10-digit number"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {success && <div className={styles.success}>{success}</div>}
        <button className={styles.btn} onClick={handleCreate} disabled={loading}>
          {loading ? "Starting…" : "Start conversation"}
        </button>
      </div>
    </div>
  );
}
