import React from "react";
import {
  RootLayout,
  AuthLayout,
  ClubLayout,
} from "@kickstock/shared/src/components/layouts";
import { HomePage, LeaguePage } from "@kickstock/shared/src/components/pages";
import { SignInPage } from "@kickstock/client/src/pages/sign-in.page";
import { SignUpPage } from "@kickstock/client/src/pages/sign-up.page";
import { ClubPage } from "@kickstock/client/src/pages/club.page";
import { LandingPage } from "@kickstock/client/src/pages/landing.page";

export function getClientElementByKey(key: string): React.ReactNode {
  switch (key) {
    case "rootLayout":
      return <RootLayout />;
    case "clubLayout":
      return <ClubLayout />;
    case "authLayout":
      return <AuthLayout />;
    case "homePage":
      return <HomePage />;
    case "leaguePage":
      return <LeaguePage />;
    case "signInPage":
      return <SignInPage />;
    case "signUpPage":
      return <SignUpPage />;
    case "clubPage":
      return <ClubPage />;
    case "landingPage":
      return <LandingPage />;
    default:
      return <>Not Found</>;
  }
}
