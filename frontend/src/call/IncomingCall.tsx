import { useCall } from "../context/CallContext";
import { useSocket } from "../context/SocketContext";
import styles from "./IncomingCall.module.css";
import { MdCall, MdCallEnd, MdVideocam } from "react-icons/md";

const IncomingCall = () => {
  const { incomingCall, setIncomingCall, setActiveCall } = useCall();
  const { socket } = useSocket();

  if (!incomingCall) return null;

  const callerName = incomingCall.name || incomingCall.phoneNumber || "Unknown";

  const accept = () => {
    socket?.emit("accept_call", { to: incomingCall.from, type: incomingCall.type });
    setActiveCall(incomingCall.type);
    setIncomingCall(null);
  };

  const reject = () => {
    socket?.emit("reject_call", { to: incomingCall.from });
    setIncomingCall(null);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div className={styles.pulse}>
          <div className={styles.avatar}>{callerName.charAt(0).toUpperCase()}</div>
        </div>

        <h2 className={styles.name}>{callerName}</h2>

        <p className={styles.text}>
          Incoming {incomingCall.type === "video" ? "video" : "voice"} call
        </p>

        <div className={styles.actions}>
          <button className={styles.reject} onClick={reject}>
            <MdCallEnd size={20} />
            <span>Decline</span>
          </button>
          <button className={styles.accept} onClick={accept}>
            {incomingCall.type === "video" ? <MdVideocam size={20} /> : <MdCall size={20} />}
            <span>Accept</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default IncomingCall;
