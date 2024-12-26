import { RouteObject } from "react-router";
import { HomePage } from "../pages/home.page";
import { ClubsPage } from "../pages/clubs.page";
import React from "react";

export const rootRoutes: RouteObject[] = [
  { index: true, element: <HomePage /> },
  { path: "clubs", element: <ClubsPage /> },
];
