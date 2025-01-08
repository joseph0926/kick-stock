import React, { useLayoutEffect } from "react";
import { Outlet } from "react-router";
import { NavbarServer } from "./navbar.server";
import { UrlContextProvider } from "../../../providers/url.context";
import { socketStore } from "../../../store/socket-store";

export function RootLayout() {
  useLayoutEffect(() => {
    socketStore.connect();

    return () => socketStore.disconnect();
  }, []);

  return (
    <UrlContextProvider>
      <div className="flex min-h-screen w-full items-start max-md:mt-24 md:items-center">
        <NavbarServer />
        <Outlet />
      </div>
    </UrlContextProvider>
  );
}
