import { RouteObject } from "react-router";
import { ROUTER } from "../constants/router";
import { RootLayout } from "../layouts/root.layout";
import { rootRoutes } from "./root.routes";
import React from "react";

export const routes: RouteObject[] = [
  {
    path: ROUTER.HOME,
    element: <RootLayout />,
    children: rootRoutes,
  },
];
