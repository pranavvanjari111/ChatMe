import { useCall } from "../context/CallContext";
import { useSocket } from "../context/SocketContext";
import { useWebRTC } from "./useWebRTC";
import { useUser } from "../context/UserContext";
import { MdCallEnd } from "react-icons/md";
import styles from "./CallScreen.module.css";

const CallScreen = () => {
  const { activeCall, setActiveCall, incomingCall } = useCall();
  const { socket } = useSocket();
  const { user } = useUser(); // FIX: use context, not localStorage

  const { localVideoRef, remoteVideoRef, remoteAudioRef, endCall } = useWebRTC(socket, user?._id);

  if (!socket || !activeCall) return null;

  const otherName = incomingCall?.name || incomingCall?.phoneNumber || "Connected";

  const handleEnd = () => {
    endCall();
    setActiveCall(null);
    if (incomingCall?.from) {
      socket?.emit("end_call", { to: incomingCall.from });
    }
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.top}>
        <div className={styles.avatar}>{otherName.charAt(0).toUpperCase()}</div>
        <h2 className={styles.name}>{otherName}</h2>
        <p className={styles.status}>
          {activeCall === "video" ? "Video Call" : "Voice Call"}
        </p>
      </div>

      <div className={styles.mediaArea}>
        {activeCall === "audio" && (
          <>
            <audio ref={remoteAudioRef} autoPlay playsInline />
            <div className={styles.audioBox}>
              <div className={styles.audioWave}>
                <span /><span /><span /><span /><span />
              </div>
              <p>Call connected</p>
            </div>
          </>
        )}

        {activeCall === "video" && (
          <>
            <video ref={remoteVideoRef} autoPlay playsInline className={styles.remoteVideo} />
            <video ref={localVideoRef} autoPlay playsInline muted className={styles.localVideo} />
          </>
        )}
      </div>

      <button className={styles.endBtn} onClick={handleEnd}>
        <MdCallEnd size={20} /> End call
      </button>
    </div>
  );
};

export default CallScreen;
