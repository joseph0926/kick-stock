import { io, Socket } from "socket.io-client";
import {
  ClubValue,
  ValuesType as LeagueValue,
} from "@kickstock/shared/src/types/prisma.type";

interface SocketStore {
  socket: Socket | null;
  isConnected: boolean;
  valueMap: {
    club: Map<string, ClubValue>;
    league: Map<string, LeagueValue>;
  };
}

type SocketEventMap = {
  clubValueResponse: (data: ClubValue) => void;
  clubValueUpdated: (data: { clubId: string; updatedValue: ClubValue }) => void;
  leagueValueResponse: (data: LeagueValue) => void;
  leagueValueUpdated: (data: {
    leagueId: string;
    updatedValue: LeagueValue;
  }) => void;
};

class SocketStoreImpl {
  private static instance: SocketStoreImpl;
  private state: SocketStore;
  private subscribers: Set<() => void>;
  private eventSubscribers: Map<string, Set<(data: any) => void>>;

  private constructor() {
    this.state = {
      socket: null,
      isConnected: false,
      valueMap: {
        club: new Map(),
        league: new Map(),
      },
    };
    this.subscribers = new Set();
    this.eventSubscribers = new Map();
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new SocketStoreImpl();
    }
    return this.instance;
  }

  private getKey(id: string, year: string) {
    return `${id}_${year}`;
  }

  private emitChange() {
    this.subscribers.forEach((callback) => callback());
  }

  connect() {
    if (this.state.socket?.connected) return;

    const serverUrl =
      process.env.NODE_ENV === "production"
        ? "https://api-kick-stock.onrender.com"
        : "http://localhost:4000";

    const socket = io(serverUrl, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socket.on("connect", () => {
      console.log(`[client]: Socket.IO 연결 성공`);
      this.state = { ...this.state, socket, isConnected: true };
      this.emitChange();
    });

    socket.on("disconnect", () => {
      this.state = { ...this.state, isConnected: false };
      this.emitChange();
    });

    socket.on("connect_error", (err) => {
      console.error("[client]: Socket.IO 연결에 실패하였습니다:", err);
      this.state = { ...this.state, isConnected: false };
      this.emitChange();
    });

    this.setupValueHandlers(socket);
  }

  private setupValueHandlers(socket: Socket) {
    socket.on("clubValueResponse", (data: ClubValue) => {
      const key = this.getKey(data.clubId, data.year);
      this.state.valueMap.club.set(key, data);
      this.emitChange();
      this.notifyEventSubscribers("clubValueResponse", data);
    });

    socket.on(
      "clubValueUpdated",
      (data: { clubId: string; updatedValue: ClubValue }) => {
        const key = this.getKey(data.clubId, data.updatedValue.year);
        this.state.valueMap.club.set(key, data.updatedValue);
        this.emitChange();
        this.notifyEventSubscribers("clubValueUpdated", data);
      },
    );

    socket.on("leagueValueResponse", (data: LeagueValue) => {
      const key = this.getKey(data.leagueId, data.year);
      this.state.valueMap.league.set(key, data);
      this.emitChange();
      this.notifyEventSubscribers("leagueValueResponse", data);
    });

    socket.on(
      "leagueValueUpdated",
      (data: { leagueId: string; updatedValue: LeagueValue }) => {
        const key = this.getKey(data.leagueId, data.updatedValue.year);
        this.state.valueMap.league.set(key, data.updatedValue);
        this.emitChange();
        this.notifyEventSubscribers("leagueValueUpdated", data);
      },
    );
  }

  private notifyEventSubscribers<K extends keyof SocketEventMap>(
    event: K,
    data: Parameters<SocketEventMap[K]>[0],
  ) {
    const subscribers = this.eventSubscribers.get(event);
    subscribers?.forEach((callback) => callback(data));
  }

  subscribe(callback: () => void) {
    this.subscribers.add(callback);
    return () => {
      this.subscribers.delete(callback);
    };
  }

  subscribeToEvent<K extends keyof SocketEventMap>(
    event: K,
    callback: SocketEventMap[K],
  ) {
    if (!this.eventSubscribers.has(event)) {
      this.eventSubscribers.set(event, new Set());
    }
    this.eventSubscribers.get(event)!.add(callback);

    return () => {
      this.eventSubscribers.get(event)?.delete(callback);
    };
  }

  getValue(type: "club" | "league", id: string, year: string) {
    const key = this.getKey(id, year);
    return this.state.valueMap[type].get(key);
  }

  disconnect() {
    this.state.socket?.disconnect();
    this.state = {
      socket: null,
      isConnected: false,
      valueMap: {
        club: new Map(),
        league: new Map(),
      },
    };
    this.emitChange();
  }

  requestClubValue(clubId: string, year: string) {
    this.state.socket?.emit("requestClubValue", { clubId, year });
  }

  updateClubValue(clubId: string, year: string, KRW: number) {
    this.state.socket?.emit("updateClubValue", { clubId, year, KRW });
  }

  requestLeagueValue(leagueId: string, year: string) {
    this.state.socket?.emit("requestLeagueValue", { leagueId, year });
  }

  updateLeagueValue(leagueId: string, year: string, KRW: number) {
    this.state.socket?.emit("updateLeagueValue", { leagueId, year, KRW });
  }

  getSnapshot() {
    return this.state;
  }

  getServerSnapshot() {
    return {
      socket: null,
      isConnected: false,
      valueMap: {
        club: new Map(),
        league: new Map(),
      },
    };
  }
}

export const socketStore = SocketStoreImpl.getInstance();
