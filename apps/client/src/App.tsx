"use client";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { clientRoutes } from "@kickstock/client/src/lib/build-routes";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";

const router = createBrowserRouter(clientRoutes, {
  hydrationData: window.__staticRouterHydrationData,
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
