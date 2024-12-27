import React from "react";
import { ROUTER } from "@shared/constants/router";
import { RouteObject } from "react-router";
import { rootRoute } from "./root.route";
import { authRoute } from "./auth.route";
import { LandingPage, RootLayout } from "@client/pages";

export const routes: RouteObject[] = [
  {
    path: ROUTER.HOME,
    element: <RootLayout />,
    children: rootRoute,
  },
  {
    lazy: async () => {
      const { AuthLayout } = await import("@client/pages/layouts/auth.layout");
      return { Component: AuthLayout };
    },
    children: authRoute,
  },
  {
    path: ROUTER.LANDING,
    element: <LandingPage />,
  },
];
