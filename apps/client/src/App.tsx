"use client";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import QueryProvider from "@kickstock/shared/src/providers/query.provider";
import { clientRoutes } from "@kickstock/client/src/lib/build-routes";

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
