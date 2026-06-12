// frontend/src/context/SocketContext.tsx

import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Socket } from "socket.io-client";

import { useUser } from "./UserContext";
import { useCall } from "./CallContext";

import { connectSocket, disconnectSocket } from "../socket/socket";

interface SocketContextType {
  socket: Socket | null;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
});

interface Props {
  children: ReactNode;
}

export const SocketProvider = ({ children }: Props) => {
  const { user } = useUser();
  const { setIncomingCall, setActiveCall } = useCall();

  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (!user?._id) return;

    console.log("Initializing socket for:", user._id);

    const token = localStorage.getItem("authToken") || undefined;
    const socketInstance = connectSocket(user._id, token);
    setSocket(socketInstance);

    /* ---------- CONNECT ---------- */
    const handleConnect = () => {
      console.log("Socket connected:", socketInstance.id);

      // Force join personal room
      socketInstance.emit("setup", user._id);
      console.log("setup emitted again:", user._id);
    };

    /* ---------- INCOMING CALL ---------- */
    const handleIncomingCall = (data: any) => {
      console.log("Incoming call:", data);

      setIncomingCall({
        from: data.from,
        type: data.type,
      });
    };

    /* ---------- CALL ACCEPTED ---------- */
    const handleCallAccepted = (data: any) => {
      console.log("Call accepted:", data);

      setActiveCall(data?.type || "audio");
    };

    /* ---------- CALL REJECTED ---------- */
    const handleCallRejected = () => {
      console.log("Call rejected");

      alert("Call rejected");
      setIncomingCall(null);
      setActiveCall(null);
    };

    /* ---------- CALL ENDED ---------- */
    const handleCallEnded = () => {
      console.log("Call ended");

      setIncomingCall(null);
      setActiveCall(null);
    };

    /* ---------- LISTENERS ---------- */
    socketInstance.on("connect", handleConnect);
    socketInstance.on("incoming_call", handleIncomingCall);
    socketInstance.on("call_accepted", handleCallAccepted);
    socketInstance.on("call_rejected", handleCallRejected);
    socketInstance.on("call_ended", handleCallEnded);

    return () => {
      console.log("Cleaning up socket...");

      socketInstance.off("connect", handleConnect);
      socketInstance.off("incoming_call", handleIncomingCall);
      socketInstance.off("call_accepted", handleCallAccepted);
      socketInstance.off("call_rejected", handleCallRejected);
      socketInstance.off("call_ended", handleCallEnded);

      disconnectSocket();
      setSocket(null);
    };
  }, [user?._id, setIncomingCall, setActiveCall]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  return useContext(SocketContext);
};
