import React from "react";
import { Outlet } from "react-router";
import { getLeaguesData } from "../../../services/league.service";
import { NavbarServer } from "./navbar.server";

export async function loader() {
  const leaguesData = await getLeaguesData();
  return leaguesData;
}

export function RootLayout() {
  return (
    <div className="flex min-h-screen w-full items-center">
      <NavbarServer />
      <Outlet />
    </div>
  );
}
