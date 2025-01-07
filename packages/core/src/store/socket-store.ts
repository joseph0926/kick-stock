import { io, Socket } from "socket.io-client";
import { ClubValue } from "@kickstock/shared/src/types/prisma.type";

interface SocketStore {
  socket: Socket | null;
  clubValue: ClubValue | null;
  // TODO: 테스트용 - 제거 예정
  realtimeData: Array<{
    timestamp: string;
    value: number;
    message: string;
  }>;
  messages: Array<{
    type: "server" | "broadcast";
    content: string;
  }>;
}

const createSocketStore = () => {
  const serverUrl =
    process.env.NODE_ENV === "production"
      ? "https://kick-stock.onrender.com"
      : "http://localhost:4000";

  const initialState: SocketStore = {
    socket: null,
    clubValue: null,
    // TODO: 테스트용 - 제거 예정
    realtimeData: [],
    messages: [],
  };

  let state = initialState;
  const subscribers = new Set<() => void>();

  if (typeof window !== "undefined") {
    const socket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log(`[client]: Socket.IO 연결 성공`);
      state = { ...state, socket };
      emitChange();
    });

    socket.on("clubValueResponse", (data: ClubValue) => {
      state = { ...state, clubValue: data };
      emitChange();
    });

    socket.on(
      "clubValueUpdated",
      (data: { clubId: string; updatedValue: ClubValue }) => {
        state = { ...state, clubValue: data.updatedValue };
        emitChange();
      },
    );

    socket.on("connect_error", (err) => {
      console.error("[client]: Socket.IO 연결에 실패하였습니다:", err);
    });

    // TODO: 테스트용 - 제거 예정
    socket.on("realTimeUpdate", (data) => {
      state = {
        ...state,
        realtimeData: [...state.realtimeData.slice(-9), data],
      };
      emitChange();
    });

    socket.on("serverResponse", (message) => {
      state = {
        ...state,
        messages: [...state.messages, { type: "server", content: message }],
      };
      emitChange();
    });

    socket.on("broadcastMessage", (message) => {
      state = {
        ...state,
        messages: [...state.messages, { type: "broadcast", content: message }],
      };
      emitChange();
    });
  }

  const emitChange = () => {
    subscribers.forEach((callback) => callback());
  };

  return {
    subscribe(callback: () => void) {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
        if (typeof window !== "undefined") {
          state.socket?.disconnect();
        }
      };
    },
    getSnapshot() {
      return state;
    },
    getServerSnapshot() {
      return initialState;
    },
    requestClubValue(clubId: string, year: string) {
      state.socket?.emit("requestClubValue", { clubId, year });
    },
    updateClubValue(clubId: string, year: string, KRW: number) {
      state.socket?.emit("updateClubValue", { clubId, year, KRW });
    },
    // TODO: 테스트용 - 제거 예정
    sendMessage(message: string) {
      state.socket?.emit("clientMessage", message);
    },
  };
};

export const socketStore = createSocketStore();
