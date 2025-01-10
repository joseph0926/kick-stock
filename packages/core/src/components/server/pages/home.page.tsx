import React from "react";
import { HomeTab } from "../home/home-tab";

export function HomePage() {
  return (
    <div className="flex w-full flex-col gap-6 px-4 sm:px-6 md:px-10">
      <div className="to-bg absolute left-1/2 z-10 ml-[-500px] h-[500px] w-[1000px] rounded-full bg-gradient-to-r from-primary opacity-20 blur-[150px]" />
      <HomeTab />
    </div>
  );
}
