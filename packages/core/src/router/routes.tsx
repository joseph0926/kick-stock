import React from "react";
import { RouteObject } from "react-router";
import { ROUTER } from "@kickstock/shared/src/constants/router";
import {
  AuthLayout,
  loader as rootLayoutLoader,
  RootLayout,
} from "../components/server/layouts";
import { HomePage } from "../components/server/pages";
import { SignInPage } from "../components/client/pages/sign-in.page";
import { LeaguePage } from "../components/client/pages";
import { LandingPage } from "../components/client/pages/landing.page";

export const routes: RouteObject[] = [
  {
    id: "root",
    path: ROUTER.HOME,
    element: <RootLayout />,
    loader: rootLayoutLoader,
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
