"use server";

import React, { Suspense } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@kickstock/ui/src/components/ui/tabs";
import { Card, CardContent } from "@kickstock/ui/src/components/ui/card";
import { cn } from "@/lib/utils";
import { LeagueTabData } from "@/types/league.type";

type LeagueTabsProps = {
  tabs: LeagueTabData[];
  defaultValue?: string;
  className?: string;
};

export const LeagueTabs = ({
  tabs,
  defaultValue = tabs[0]?.value,
  className = "",
}: LeagueTabsProps) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      className={cn("mx-auto w-full max-w-3xl", className)}
    >
      <TabsList className="grid h-14 w-full grid-cols-3 rounded-lg bg-zinc-100 p-1 dark:bg-zinc-800">
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.value}
            value={tab.value}
            className="flex items-center gap-2 rounded-md data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm dark:data-[state=active]:bg-zinc-900 dark:data-[state=active]:text-zinc-50"
          >
            {tab.icon}
            <span className="font-medium">{tab.label}</span>
          </TabsTrigger>
        ))}
      </TabsList>
      {tabs.map((tab) => (
        <TabsContent
          key={tab.value}
          value={tab.value}
          className="mt-6 rounded-lg border border-zinc-200 dark:border-zinc-800"
        >
          <Card className="border-none">
            <CardContent className="p-6">
              <Suspense fallback={<div>Loading,,,</div>}></Suspense>
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
