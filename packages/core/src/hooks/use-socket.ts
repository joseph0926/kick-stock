import { useCallback, useSyncExternalStore } from "react";
import { socketStore } from "../store/socket-store";

export const useSocket = () => {
  const state = useSyncExternalStore(
    socketStore.subscribe,
    socketStore.getSnapshot,
    socketStore.getSnapshot,
  );

  const requestClubValue = useCallback((clubId: string, year: string) => {
    socketStore.requestClubValue(clubId, year);
  }, []);

  const updateClubValue = useCallback(
    (clubId: string, year: string, KRW: number) => {
      socketStore.updateClubValue(clubId, year, KRW);
    },
    [],
  );

  // TODO: 테스트용 - 제거 예정
  const sendMessage = useCallback((message: string) => {
    socketStore.sendMessage(message);
  }, []);

  return {
    ...state,
    requestClubValue,
    updateClubValue,
    sendMessage,
  };
};
