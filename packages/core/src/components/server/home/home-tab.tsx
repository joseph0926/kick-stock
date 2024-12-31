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

export const HomeTab = () => {
  const { onUpdateSearchParams, searchParams } = useUrlContext();
  const market = searchParams.get("market");

  const translateX = useMemo(() => {
    const index = homeTab.findIndex((tab) => tab.value === market);
    return `translateX(${index * 100}%)`;
  }, [market]);

  return (
    <Tabs
      defaultValue={market || "all"}
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
            className="w-20 rounded-none text-xl font-semibold data-[state=active]:bg-transparent"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {homeTab.map((item) => (
        <TabsContent key={item.value} value={item.value}>
          <HomeInnerTab />
        </TabsContent>
      ))}
    </Tabs>
  );
};
