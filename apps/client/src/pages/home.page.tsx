"use server";

import React from "react";
import { LeagueTabs } from "@/components/server/clubs/league-tabs.server";
import { leagueTabs } from "@kickstock/shared/src/constants/league-tabs";

export function HomePage() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 sm:px-6 md:px-10">
      <LeagueTabs tabs={leagueTabs} />
    </div>
  );
}
