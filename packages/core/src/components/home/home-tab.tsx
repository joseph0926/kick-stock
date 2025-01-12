import React, { useDeferredValue, useMemo, useTransition } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kickstock/ui/src/components/ui/tabs";
import { homeTab } from "@kickstock/shared/src/constants/home/home-tab";
import { useUrlContext } from "../../hooks/use-url-context";
import { HomeTabType } from "@kickstock/shared/src/types/common.type";
import { cn } from "@kickstock/ui/src/lib/utils";
import { HomeInnerTab } from "./home-inner-tab";
import { HomeInnerTabMobile } from "./home-inner-tab.mobile";

export const HomeTab = () => {
  const { onUpdateSearchParams, searchParams } = useUrlContext();
  const market = (searchParams.get("market") as HomeTabType) ?? "all";

  const [isPending, startTransition] = useTransition();
  const deferredMarket = useDeferredValue(market);
  const isStale = market !== deferredMarket;

  const translateX = useMemo(() => {
    const index =
      homeTab.findIndex((tab) => tab.value === market) === -1
        ? 0
        : homeTab.findIndex((tab) => tab.value === market);
    return `translateX(${index * 100}%)`;
  }, [market]);

  const onTabValueChange = (e: string) => {
    startTransition(() => onUpdateSearchParams({ market: e }, "replace"));
  };

  return (
    <Tabs defaultValue={market} onValueChange={onTabValueChange}>
      <TabsList className="relative bg-transparent">
        <div
          className="absolute -bottom-1 left-1 h-1 w-24 bg-foreground transition-transform duration-300 ease-in-out will-change-transform"
          style={{
            transform: market ? translateX : "translateX(0)",
          }}
        />
        {homeTab.map((item) => (
          <TabsTrigger
            disabled={isPending}
            key={item.value}
            value={item.value}
            className="w-24 rounded-none text-xl font-semibold first:mr-20 data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="relative hidden min-h-[50vh] md:block">
        <div
          className={cn(
            "absolute left-0 top-0 w-full transition-opacity duration-300",
            isStale ? "opacity-50" : "opacity-100",
          )}
        >
          <TabsContent value={market} forceMount>
            <HomeInnerTab outerTabValue={market} />
          </TabsContent>
        </div>
        {isStale && (
          <div className="absolute left-0 top-0 w-full" aria-hidden="true">
            <TabsContent value={deferredMarket} forceMount>
              <HomeInnerTab outerTabValue={deferredMarket} />
            </TabsContent>
          </div>
        )}
      </div>
      <div className="block w-full p-6 pt-8 md:hidden">
        <HomeInnerTabMobile outerTabValue={market} />
      </div>
    </Tabs>
  );
};
