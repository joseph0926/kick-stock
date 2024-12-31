import React from "react";
import { Outlet } from "react-router";
import { getLeaguesData } from "../../../services/league.service";
import { Navbar } from "../../client/layouts/navbar";

export async function loader() {
  const leaguesData = await getLeaguesData();
  return leaguesData;
}

export function RootLayout() {
  const [mounted, setMounted] = React.useState<boolean>(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return (
    <div className="flex min-h-screen w-full items-center">
      <Navbar />
      <Outlet />
    </div>
  );
}
