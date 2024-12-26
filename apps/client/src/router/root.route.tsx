import React from "react";
import { HomePage } from "@/pages";
import { RouteObject } from "react-router";

export const rootRoute: RouteObject[] = [
  { index: true, element: <HomePage /> },
];
