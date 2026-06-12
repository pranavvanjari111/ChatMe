import { useEffect, useRef } from "react";

type CallMode = "audio" | "video";

export const useWebRTC = (socket: any, currentUserId: string) => {
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localStream = useRef<MediaStream | null>(null);
  const remoteUserId = useRef("");
  const pendingCandidates = useRef<any[]>([]);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const remoteAudioRef = useRef<HTMLAudioElement>(null);

  const createPeer = () => {
    if (peerConnection.current) {
      peerConnection.current.close();
    }
    peerConnection.current = new RTCPeerConnection({
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
      ],
    });

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && remoteUserId.current) {
        socket?.emit("ice_candidate", {
          to: remoteUserId.current,
          candidate: event.candidate,
        });
      }
    };

    peerConnection.current.ontrack = (event) => {
      const [stream] = event.streams;
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = stream;
      }
    };
  };

  const flushCandidates = async () => {
    while (pendingCandidates.current.length > 0) {
      const candidate = pendingCandidates.current.shift();
      try {
        await peerConnection.current?.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn("Failed to add ICE candidate:", e);
      }
    }
  };

  const startLocalStream = async (mode: CallMode) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: mode === "video",
      });
      localStream.current = stream;

      if (mode === "video" && localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
        localVideoRef.current.muted = true;
      }

      stream.getTracks().forEach((track) => {
        peerConnection.current?.addTrack(track, stream);
      });
    } catch (err) {
      console.error("Failed to get user media:", err);
      throw err;
    }
  };

  // FIX: callUser now correctly takes (to, mode) params
  const callUser = async (to: string, mode: CallMode) => {
    remoteUserId.current = to;
    createPeer();
    await startLocalStream(mode);

    socket?.emit("call_user", { to, from: currentUserId, type: mode });

    const offer = await peerConnection.current!.createOffer();
    await peerConnection.current!.setLocalDescription(offer);

    socket?.emit("offer", { to, offer, type: mode });
  };

  const endCall = () => {
    peerConnection.current?.close();
    peerConnection.current = null;
    localStream.current?.getTracks().forEach((track) => track.stop());
    localStream.current = null;
    pendingCandidates.current = [];
    remoteUserId.current = "";

    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (remoteAudioRef.current) remoteAudioRef.current.srcObject = null;
  };

  useEffect(() => {
    if (!socket) return;

    const handleOffer = async ({ from, offer, type }: any) => {
      remoteUserId.current = from;
      const mode: CallMode = type === "video" ? "video" : "audio";

      createPeer();
      await startLocalStream(mode);

      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(offer));
      await flushCandidates();

      const answer = await peerConnection.current?.createAnswer();
      await peerConnection.current?.setLocalDescription(answer!);
      socket.emit("answer", { to: from, answer });
    };

    const handleAnswer = async ({ answer }: any) => {
      await peerConnection.current?.setRemoteDescription(new RTCSessionDescription(answer));
      await flushCandidates();
    };

    const handleIceCandidate = async ({ candidate }: any) => {
      if (!peerConnection.current?.remoteDescription) {
        pendingCandidates.current.push(candidate);
        return;
      }
      try {
        await peerConnection.current.addIceCandidate(new RTCIceCandidate(candidate));
      } catch (e) {
        console.warn("ICE candidate error:", e);
      }
    };

    socket.on("offer", handleOffer);
    socket.on("answer", handleAnswer);
    socket.on("ice_candidate", handleIceCandidate);

    return () => {
      socket.off("offer", handleOffer);
      socket.off("answer", handleAnswer);
      socket.off("ice_candidate", handleIceCandidate);
    };
  }, [socket]);

  return { localVideoRef, remoteVideoRef, remoteAudioRef, callUser, endCall };
};
