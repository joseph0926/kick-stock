import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "@kickstock/core/src/router/routes.tsx";
import { QueryProvider } from "@kickstock/core/src/providers/query.provider";
import { ThemeProvider } from "next-themes";

const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

export function ClientRoot() {
  return (
    // <ThemeProvider
    //   attribute="class"
    //   defaultTheme="dark"
    //   enableSystem={false}
    //   disableTransitionOnChange
    // >
    <QueryProvider>
      <RouterProvider router={router} />
    </QueryProvider>
    // </ThemeProvider>
  );
}
