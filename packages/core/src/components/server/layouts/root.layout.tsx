import React from "react";
import { Outlet } from "react-router";
import { getLeague } from "../../../services/league.service";
import { Navbar } from "../../client/layouts/navbar";

export async function loader() {
  const leagueData = await getLeague("epl");
  return leagueData;
}

export function RootLayout() {
  return (
    <div className="bg-background-transparent flex min-h-screen w-full items-center">
      <Navbar />
      <Outlet />
    </div>
  );
}
