import React, { memo, useCallback, useMemo } from "react";
import {
  homeClubTab,
  homeLeagueTab,
} from "@kickstock/shared/src/constants/home/home-tab";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@kickstock/ui/src/components/ui/tabs";
import { useUrlContext } from "../../hooks/use-url-context";
import { HomeTabContent } from "./home-tab-content";
import {
  HomeInnerTabType,
  HomeTabType,
} from "@kickstock/shared/src/types/common.type";
import { LeagueType } from "@kickstock/shared/src/types/league.type";

type HomeInnerTabProps = {
  outerTabValue: HomeTabType;
};

export const HomeInnerTab = memo(({ outerTabValue }: HomeInnerTabProps) => {
  const { onUpdateSearchParams, searchParams } = useUrlContext();
  const indicator = searchParams.get("indicator") as
    | HomeInnerTabType
    | LeagueType;

  const getTabValue = useCallback(() => {
    switch (outerTabValue) {
      case "all":
        return homeLeagueTab;
      case "club":
        return homeClubTab;
      case "player":
        return [];
      default:
        return homeLeagueTab;
    }
  }, [outerTabValue]);

  const innerTabValue = getTabValue();
  const fallbackTabValue = innerTabValue[0].value;

  const translateX = useMemo(() => {
    const index =
      innerTabValue.findIndex((tab) => tab.value === indicator) === -1
        ? 0
        : innerTabValue.findIndex((tab) => tab.value === indicator);

    const gapWidth = 16;
    const slideWidth = 96;
    const totalMove = slideWidth * index + gapWidth * index;

    return `translateX(${totalMove}px)`;
  }, [indicator, innerTabValue]);

  return (
    <Tabs
      defaultValue={indicator ?? fallbackTabValue}
      onValueChange={(e) => onUpdateSearchParams({ indicator: e }, "update")}
      className="px-2 pt-8"
    >
      <TabsList className="relative gap-4 bg-transparent">
        <div
          className="absolute left-1 -z-10 h-10 w-24 translate-x-0 rounded-2xl bg-background transition-transform duration-300 ease-in-out will-change-transform"
          style={{
            transform: indicator ? translateX : "translateX(0)",
          }}
        />
        {innerTabValue.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="w-24 rounded-none text-center text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <HomeTabContent outerTabValue={outerTabValue} innerTabValue={indicator} />
    </Tabs>
  );
});

HomeInnerTab.displayName = "HomeInnerTab";
