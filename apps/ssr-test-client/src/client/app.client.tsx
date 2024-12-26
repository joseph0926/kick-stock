"use client";

import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import { routes } from "../shared/routes";

const router = createBrowserRouter(routes, {
  hydrationData: window.__staticRouterHydrationData,
});

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
