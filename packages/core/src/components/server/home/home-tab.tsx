import React, { useMemo } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kickstock/ui/src/components/ui/tabs";
import { homeTab } from "@kickstock/shared/src/constants/home/home-tab";
import { useUrlContext } from "../../../hooks/use-url-context";
import { HomeInnerTab } from "./home-inner-tab";
import { HomeClubTable } from "../../shared/table/home-club-table";

export const HomeTab = () => {
  const { onUpdateSearchParams, searchParams } = useUrlContext();
  const market = searchParams.get("market");

  const translateX = useMemo(() => {
    const index = homeTab.findIndex((tab) => tab.value === market);
    return `translateX(${index * 100}%)`;
  }, [market]);

  return (
    <Tabs
      defaultValue={market || homeTab[0].value}
      onValueChange={(e) => onUpdateSearchParams({ market: e }, "update")}
    >
      <TabsList className="relative bg-transparent">
        <div
          className="absolute -bottom-1 left-1 h-1 w-20 bg-foreground transition-transform duration-300 ease-in-out will-change-transform"
          style={{
            transform: market ? translateX : "translateX(0)",
          }}
        />
        {homeTab.map((item) => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className="w-20 rounded-none text-xl font-semibold data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <TabsContent value={homeTab[0].value}>
        <HomeInnerTab outerTabValue={homeTab[0].value} />
      </TabsContent>
      <TabsContent value={homeTab[1].value}>
        <HomeClubTable league="epl" />
      </TabsContent>
    </Tabs>
  );
};
