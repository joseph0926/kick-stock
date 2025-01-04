import React from "react";
import { Outlet } from "react-router";
import { NavbarServer } from "./navbar.server";
import { UrlContextProvider } from "../../../providers/url.context";

export function RootLayout() {
  return (
    <UrlContextProvider>
      <div className="flex min-h-screen w-full items-center">
        <NavbarServer />
        <Outlet />
      </div>
    </UrlContextProvider>
  );
}
