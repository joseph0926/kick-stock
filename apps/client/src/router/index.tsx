import { createBrowserRouter } from "react-router";
import { ROUTER } from "@/constants/router";
import { HomePage, LandingPage, RootLayout } from "@/pages";

export const router = createBrowserRouter([
  {
    path: ROUTER.HOME,
    element: <RootLayout />,
    children: [{ index: true, element: <HomePage /> }],
  },
  {
    lazy: async () => {
      const { AuthLayout } = await import("@/pages/layouts/auth.layout");
      return { Component: AuthLayout };
    },
    children: [
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
    ],
  },
  {
    path: ROUTER.LANDING,
    element: <LandingPage />,
  },
]);
