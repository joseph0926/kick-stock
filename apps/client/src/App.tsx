"use client";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import QueryProvider from "@kickstock/shared/providers/query.provider";
import { clientRoutes } from "./lib/build-routes";

const router = createBrowserRouter(clientRoutes, {
  hydrationData: window.__staticRouterHydrationData,
});

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
