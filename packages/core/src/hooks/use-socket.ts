import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const serverUrl =
      process.env.NODE_ENV === "production"
        ? "https://kick-stock.onrender.com"
        : "http://localhost:4000";

    socketRef.current = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current.on("connect", () => {
      console.log("[client]: Socket.IO 연결 성공!!");
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("[client]: Socket.IO 연결에 실패하였습니다:", err);
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  return socketRef.current;
};
