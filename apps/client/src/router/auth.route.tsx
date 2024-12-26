import React from "react";
import { ROUTER } from "@/constants/router";
import { RouteObject } from "react-router";

export const authRoute: RouteObject[] = [
  {
    path: ROUTER.SIGNIN,
    lazy: async () => {
      const { SignInPage } = await import("@/pages/sign-in.page");
      return { Component: SignInPage };
    },
  },
  {
    path: ROUTER.SIGNUP,
    lazy: async () => {
      const { SignUpPage } = await import("@/pages/sign-up.page");
      return { Component: SignUpPage };
    },
  },
];
