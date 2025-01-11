import { useSyncExternalStore } from "react";
import { socketStore } from "../store/socket-store";

export const useSocket = () => {
  const state = useSyncExternalStore(
    socketStore.subscribe,
    socketStore.getSnapshot,
    socketStore.getServerSnapshot,
  );

  return {
    isConnected: state.isConnected,
    connect: socketStore.connect,
    disconnect: socketStore.disconnect,
  };
};
