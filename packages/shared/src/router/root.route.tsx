import React from "react";
import { HomePage } from "@kickstock/ssr-client/pages/home.page";
import { RouteObject } from "react-router";

export const rootRoute: RouteObject[] = [
  { index: true, element: <HomePage /> },
];
