import React, { memo, useMemo } from "react";
import {
  homeInnerTab,
  homeTab,
} from "@kickstock/shared/src/constants/home/home-tab";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@kickstock/ui/src/components/ui/tabs";
import { useUrlContext } from "../../../hooks/use-url-context";
import { HomeTabContent } from "./home-tab-content";
import {
  HomeInnerTabType,
  HomeTabType,
} from "@kickstock/shared/src/types/common.type";

type HomeInnerTabProps = {
  outerTabValue: HomeTabType;
};

export const HomeInnerTab = memo(({ outerTabValue }: HomeInnerTabProps) => {
  const { onUpdateSearchParams, searchParams } = useUrlContext();
  const indicator = searchParams.get("indicator") as HomeInnerTabType;

  const translateX = useMemo(() => {
    const index = homeInnerTab.findIndex((tab) => tab.value === indicator);
    return `translateX(${index * 100}%)`;
  }, [indicator]);

  return (
    <Tabs
      defaultValue={indicator || homeInnerTab[0].value}
      onValueChange={(e) => onUpdateSearchParams({ indicator: e }, "update")}
      className="px-2 pt-8"
    >
      <TabsList className="relative bg-transparent">
        <div
          className="absolute left-1 -z-10 h-10 w-24 rounded-2xl bg-background transition-transform duration-300 ease-in-out will-change-transform"
          style={{
            transform: indicator ? translateX : "translateX(0)",
          }}
        />
        {homeInnerTab.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="w-24 rounded-none text-center text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {outerTabValue === "all" && (
        <HomeTabContent innerTabValue={indicator || "index"} />
      )}
    </Tabs>
  );
});

HomeInnerTab.displayName = "HomeInnerTab";
