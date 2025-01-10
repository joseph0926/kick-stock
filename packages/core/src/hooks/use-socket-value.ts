import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { socketStore } from "../store/socket-store";

type UseSocketValueProps = {
  type: "league" | "club";
  id: string;
  year: string;
};

export const useSocketValue = ({ type, id, year }: UseSocketValueProps) => {
  const value = useSyncExternalStore(
    (callback) => socketStore.subscribe(callback),
    () => socketStore.getValue(type, id, year),
    () => socketStore.getValue(type, id, year),
  );

  useEffect(() => {
    if (!value) {
      if (type === "league") {
        socketStore.requestLeagueValue(id, year);
      } else {
        socketStore.requestClubValue(id, year);
      }
    }
  }, [value, type, id, year]);

  const isLoading = !value;

  const updateValue = useCallback(
    (KRW: number) => {
      if (type === "league") {
        socketStore.updateLeagueValue(id, year, KRW);
      } else {
        socketStore.updateClubValue(id, year, KRW);
      }
    },
    [type, id, year],
  );

  return {
    value,
    isLoading,
    updateValue,
  };
};
