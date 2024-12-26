import React from "react";
import { ROUTER } from "@/constants/router";
import { LandingPage, RootLayout } from "@/pages";
import { RouteObject } from "react-router";
import { rootRoute } from "./root.route";
import { authRoute } from "./auth.route";

export const routes: RouteObject[] = [
  {
    path: ROUTER.HOME,
    element: <RootLayout />,
    children: rootRoute,
  },
  {
    lazy: async () => {
      const { AuthLayout } = await import("@/pages/layouts/auth.layout");
      return { Component: AuthLayout };
    },
    children: authRoute,
  },
  {
    path: ROUTER.LANDING,
    element: <LandingPage />,
  },
];
