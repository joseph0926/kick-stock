import { type Socket, io } from "socket.io-client";
import {
  ClubValue,
  ValuesType as LeagueValue,
} from "@kickstock/shared/src/types/prisma.type";

export type SocketState = {
  socket: Socket | null;
  isConnected: boolean;
  valueMap: {
    club: Map<string, ClubValue>;
    league: Map<string, LeagueValue[]>;
  };
};

export type SocketEventMap = {
  leagueValueHistory: (data: {
    leagueId: string;
    values: LeagueValue[];
  }) => void;
  leagueValueUpdated: (data: { leagueId: string; value: LeagueValue }) => void;
  error: (message: string) => void;
};

const SOCKET_URL =
  process.env.NODE_ENV === "production"
    ? "wss://api-kick-stock.onrender.com"
    : "http://localhost:4000";

const createSocketStore = () => {
  let state: SocketState = {
    socket: null,
    isConnected: false,
    valueMap: {
      club: new Map(),
      league: new Map(),
    },
  };

  const subscribers = new Set<() => void>();
  const eventSubscribers = new Map<string, Set<(data: any) => void>>();

  const emitChange = () => {
    console.log("[Store] Notifying subscribers of state change");
    subscribers.forEach((callback) => callback());
  };

  const notifyEventSubscribers = <K extends keyof SocketEventMap>(
    event: K,
    data: Parameters<SocketEventMap[K]>[0],
  ) => {
    eventSubscribers.get(event)?.forEach((callback) => callback(data));
  };

  const updateState = (newState: Partial<SocketState>) => {
    state = {
      ...state,
      ...newState,
      valueMap: {
        ...state.valueMap,
        league: new Map(state.valueMap.league),
      },
    };
    emitChange();
  };

  const setupSocket = () => {
    if (state.socket?.connected) return;

    const socket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket"],
      path: "/socket.io",
    });

    socket.on("connect", () => {
      console.log("[client]: Socket.IO 연결 성공");
      state.socket = socket;
      state.isConnected = true;
      emitChange();
    });

    socket.on("disconnect", () => {
      state.isConnected = false;
      emitChange();
    });

    socket.on("connect_error", (err) => {
      console.error("[client]: Socket.IO 연결 실패:", err);
      state.isConnected = false;
      emitChange();
      notifyEventSubscribers("error", "Socket.IO 연결에 실패했습니다.");
    });

    setupEventHandlers(socket);
    state.socket = socket;
  };

  const setupEventHandlers = (socket: Socket) => {
    socket.on(
      "leagueValueHistory",
      (data: { leagueId: string; values: LeagueValue[] }) => {
        console.log("[Socket] Received history:", data);
        const newMap = new Map(state.valueMap.league);
        newMap.set(data.leagueId, data.values);

        state = {
          ...state,
          valueMap: {
            ...state.valueMap,
            league: newMap,
          },
        };

        emitChange();
        notifyEventSubscribers("leagueValueHistory", data);
      },
    );

    socket.on(
      "leagueValueUpdated",
      (data: { leagueId: string; value: LeagueValue }) => {
        console.log("[Socket] Received update:", data);

        const currentValues = state.valueMap.league.get(data.leagueId) ?? [];
        const updatedValues = [...currentValues, data.value].slice(-50);

        const newMap = new Map(state.valueMap.league);
        newMap.set(data.leagueId, updatedValues);

        state = {
          ...state,
          valueMap: {
            ...state.valueMap,
            league: newMap,
          },
        };

        emitChange();
        notifyEventSubscribers("leagueValueUpdated", data);
      },
    );

    socket.onAny((eventName, ...args) => {
      console.log(`[Socket Debug] Event received: ${eventName}`, args);
    });

    socket.on("error", (message: string) => {
      notifyEventSubscribers("error", message);
    });
  };

  return {
    subscribe: (callback: () => void) => {
      subscribers.add(callback);
      return () => {
        subscribers.delete(callback);
      };
    },

    subscribeToEvent: <K extends keyof SocketEventMap>(
      event: K,
      callback: SocketEventMap[K],
    ) => {
      if (!eventSubscribers.has(event)) {
        eventSubscribers.set(event, new Set());
      }
      eventSubscribers.get(event)!.add(callback);
      return () => {
        eventSubscribers.get(event)?.delete(callback);
      };
    },

    connect: () => {
      if (state.socket?.connected) return;

      const socket = io(SOCKET_URL, {
        withCredentials: true,
        transports: ["websocket"],
        path: "/socket.io",
      });

      setupEventHandlers(socket);

      socket.on("connect", () => {
        console.log("[client]: Socket.IO 연결 성공");
        state = {
          ...state,
          socket,
          isConnected: true,
        };
        emitChange();
      });

      socket.on("disconnect", () => {
        state = {
          ...state,
          isConnected: false,
        };
        emitChange();
      });

      state = {
        ...state,
        socket,
      };
      emitChange();
    },

    disconnect: () => {
      state.socket?.disconnect();
      state = {
        ...state,
        socket: null,
        isConnected: false,
        valueMap: {
          club: new Map(),
          league: new Map(),
        },
      };
      emitChange();
    },

    subscribeToLeague: (leagueId: string) => {
      state.socket?.emit("subscribeLeagueValue", leagueId);
    },

    unsubscribeFromLeague: (leagueId: string) => {
      state.socket?.emit("unsubscribeLeagueValue", leagueId);
    },

    getLeagueValues: (leagueId: string) => {
      return state.valueMap.league.get(leagueId) ?? [];
    },

    getSnapshot: () => state,

    getServerSnapshot: () => state,
  };
};

export const socketStore = createSocketStore();
