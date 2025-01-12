import React from "react";
import { RouteObject } from "react-router";
import { ROUTER } from "@kickstock/shared/src/constants/router";
import { MainLoading } from "../components/shared/loading/main.loading";
import { NotFoundPage } from "../components/shared/error/not-found";
import { RootLayout, AuthLayout } from "../components/layouts";
import { HomePage, LeaguePage } from "../components/pages";
import { LandingPage } from "../components/pages/landing.page";
import { SignInPage } from "../components/pages/sign-in.page";

export const routes: RouteObject[] = [
  {
    id: "root",
    path: ROUTER.HOME,
    element: <RootLayout />,
    hydrateFallbackElement: <MainLoading />,
    errorElement: <NotFoundPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: ROUTER.LEAGUE, element: <LeaguePage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [{ path: ROUTER.SIGNIN, element: <SignInPage /> }],
  },
  {
    path: ROUTER.LANDING,
    element: <LandingPage />,
  },
];
