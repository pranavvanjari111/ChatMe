import { createContext, useContext, useState } from "react";

type CallType = "audio" | "video";

type IncomingCall = {
  from: string;
  type: CallType;
  name?: string;
  phoneNumber?: string;
};

type CallContextType = {
  incomingCall: IncomingCall | null;
  setIncomingCall: (call: IncomingCall | null) => void;
  activeCall: CallType | null;
  setActiveCall: (type: CallType | null) => void;
};

const CallContext = createContext<CallContextType | null>(null);

export const CallProvider = ({ children }: any) => {
  const [incomingCall, setIncomingCall] = useState<IncomingCall | null>(null);
  const [activeCall, setActiveCall] = useState<CallType | null>(null);

  return (
    <CallContext.Provider value={{ incomingCall, setIncomingCall, activeCall, setActiveCall }}>
      {children}
    </CallContext.Provider>
  );
};

export const useCall = () => {
  const context = useContext(CallContext);
  if (!context) throw new Error("useCall must be used inside CallProvider");
  return context;
};
