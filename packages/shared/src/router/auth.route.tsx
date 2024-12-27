import React from "react";
import { ROUTER } from "@shared/constants/router";
import { RouteObject } from "react-router";

export const authRoute: RouteObject[] = [
  {
    path: ROUTER.SIGNIN,
    lazy: async () => {
      const { SignInPage } = await import("@client/pages/sign-in.page");
      return { Component: SignInPage };
    },
  },
  {
    path: ROUTER.SIGNUP,
    lazy: async () => {
      const { SignUpPage } = await import("@client/pages/sign-up.page");
      return { Component: SignUpPage };
    },
  },
];
