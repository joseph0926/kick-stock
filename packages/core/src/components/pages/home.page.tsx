import React from "react";
import { HomeTab } from "../home/home-tab";

export function HomePage() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 sm:px-6 md:px-10">
      <HomeTab />
    </div>
  );
}
