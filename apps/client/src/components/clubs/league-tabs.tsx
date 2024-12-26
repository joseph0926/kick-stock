import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leagues } from "@/constants/leagues";

export const LeagueTabs = () => {
  return (
    <Tabs>
      <TabsList>
        {leagues.map((league) => (
          <TabsTrigger
            key={league}
            value={league}
            className="text-sm font-bold uppercase"
          >
            {league}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
