import { useCallback, useEffect, useState } from "react";
import { socketStore } from "../store/socket-store";
import {
  ClubValue,
  ValuesType as LeagueValue,
} from "@kickstock/shared/src/types/prisma.type";

type UseSocketValueProps = {
  type: "league" | "club";
  id: string;
  year: string;
};

type ValueType = ClubValue | LeagueValue;

export const useSocketValue = ({ type, id, year }: UseSocketValueProps) => {
  const [value, setValue] = useState<ValueType | null>(
    () => socketStore.getValue(type, id, year) || null,
  );
  const [isLoading, setIsLoading] = useState(!value);

  useEffect(() => {
    if (!value) {
      if (type === "league") {
        socketStore.requestLeagueValue(id, year);
      } else {
        socketStore.requestClubValue(id, year);
      }
    }

    const unsubResponse = socketStore.subscribeToEvent(
      `${type}ValueResponse`,
      (data: LeagueValue | ClubValue) => {
        if (
          (type === "league" && (data as LeagueValue).leagueId === id) ||
          (type === "club" && (data as ClubValue).clubId === id)
        ) {
          setValue(data);
          setIsLoading(false);
        }
      },
    );

    const unsubUpdate = socketStore.subscribeToEvent(
      `${type}ValueUpdated`,
      (data: {
        leagueId?: string;
        clubId?: string;
        updatedValue: LeagueValue | ClubValue;
      }) => {
        const updatedValue = data.updatedValue;
        if (
          (type === "league" && data.leagueId === id) ||
          (type === "club" && data.clubId === id)
        ) {
          setValue(updatedValue);
          setIsLoading(false);
        }
      },
    );

    return () => {
      unsubResponse();
      unsubUpdate();
    };
  }, [type, id, year]);

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
