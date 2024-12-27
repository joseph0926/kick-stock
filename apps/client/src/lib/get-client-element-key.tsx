import React from "react";
import {
  RootLayout,
  AuthLayout,
  ClubLayout,
} from "@kickstock/shared/components/layouts";
import { HomePage, LeaguePage } from "@kickstock/shared/components/pages";
import { SignInPage } from "@/pages/sign-in.page";
import { SignUpPage } from "@/pages/sign-up.page";
import { ClubPage } from "@/pages/club.page";
import { LandingPage } from "@/pages/landing.page";

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
