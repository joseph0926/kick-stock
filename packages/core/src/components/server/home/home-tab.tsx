import React, { Suspense, useMemo, useTransition } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@kickstock/ui/src/components/ui/tabs";
import { homeTab } from "@kickstock/shared/src/constants/home/home-tab";
import { useUrlContext } from "../../../hooks/use-url-context";
import { HomeTabType } from "@kickstock/shared/src/types/common.type";
import { HomeTabLoading } from "../../shared/loading/home-tab.loading";

const LazyHomeInnerTab = React.lazy(() => import("./home-inner-tab"));

export const HomeTab = () => {
  const { onUpdateSearchParams, searchParams } = useUrlContext();
  const market = (searchParams.get("market") as HomeTabType) ?? "all";

  const [isPending, startTransition] = useTransition();

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
      <Suspense fallback={<HomeTabLoading />}>
        {homeTab.map((tab) => (
          <TabsContent
            key={tab.value}
            value={tab.value}
            className="transition-opacity duration-300"
          >
            <LazyHomeInnerTab outerTabValue={tab.value} />
          </TabsContent>
        ))}
      </Suspense>
    </Tabs>
  );
};
