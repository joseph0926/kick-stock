import React from "react";
import { HomePage } from "@client/pages";
import { RouteObject } from "react-router";

export const rootRoute: RouteObject[] = [
  { index: true, element: <HomePage /> },
];
