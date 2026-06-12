import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles/globals.css";

import { UserProvider } from "./context/UserContext";
import { ChatProvider } from "./context/ChatContext";
import { SocketProvider } from "./context/SocketContext";
import { CallProvider } from "./context/CallContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <UserProvider>
        <ChatProvider>
          <CallProvider>
            <SocketProvider>
              <App />
            </SocketProvider>
          </CallProvider>
        </ChatProvider>
      </UserProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
