import { useEffect, useMemo, useSyncExternalStore } from "react";
import { socketStore } from "../store/socket-store";

export const useLeagueValues = (leagueId: string) => {
  const state = useSyncExternalStore(
    socketStore.subscribe,
    socketStore.getSnapshot,
    socketStore.getServerSnapshot,
  );

  const values = useMemo(
    () => state.valueMap.league.get(leagueId) ?? [],
    [state.valueMap.league, leagueId],
  );

  const latestValue = useMemo(() => values[values.length - 1], [values]);

  useEffect(() => {
    if (state.isConnected) {
      socketStore.subscribeToLeague(leagueId);
      return () => socketStore.unsubscribeFromLeague(leagueId);
    }
  }, [leagueId, state.isConnected]);

  return {
    values,
    latestValue,
    isLoading: state.isConnected && values.length === 0,
  };
};
