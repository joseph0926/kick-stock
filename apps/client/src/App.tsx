"use client";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import QueryProvider from "./providers/query.provider";
import { routes } from "./router";

const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

export default function App() {
  return (
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
  );
}
