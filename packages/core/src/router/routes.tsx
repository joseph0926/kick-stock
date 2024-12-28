import React from "react";
import { RouteObject } from "react-router";
import { ROUTER } from "@kickstock/shared/src/constants/router";
import { AuthLayout, RootLayout } from "../components/server/layouts";
import { HomePage } from "../components/server/pages";
import { SignInPage } from "../components/client/pages/sign-in.page";

export const routes: RouteObject[] = [
  {
    path: ROUTER.HOME,
    element: <RootLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    element: <AuthLayout />,
    children: [{ path: ROUTER.SIGNIN, element: <SignInPage /> }],
  },
];
