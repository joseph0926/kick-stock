"use client";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/query-client";
import { routes } from "@kickstock/core/src/router/routes.tsx";
import { ThemeProvider } from "@kickstock/core/src/providers/theme.provider";

const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <RouterProvider router={router} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
