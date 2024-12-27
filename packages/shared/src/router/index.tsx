import React from "react";
import { ROUTER } from "@kickstock/shared/constants/router";
import { RouteObject } from "react-router";
import { rootRoute } from "./root.route";
import { LandingPage } from "@kickstock/client/pages";
import { RootLayout } from "@kickstock/ssr-client/layouts/root.layout";

export const routes: RouteObject[] = [
  {
    path: ROUTER.HOME,
    element: <RootLayout />,
    children: rootRoute,
  },
  {
    path: ROUTER.LANDING,
    element: <LandingPage />,
  },
];
