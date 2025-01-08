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

  const requestLeagueValue = useCallback((leagueId: string, year: string) => {
    socketStore.requestLeagueValue(leagueId, year);
  }, []);

  const updateLeagueValue = useCallback(
    (leagueId: string, year: string, KRW: number) => {
      socketStore.updateLeagueValue(leagueId, year, KRW);
    },
    [],
  );

  return {
    ...state,
    requestClubValue,
    updateClubValue,
    requestLeagueValue,
    updateLeagueValue,
  };
};
