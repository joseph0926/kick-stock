import React from "react";
import {
  RootLayout,
  ClubLayout,
  AuthLayout,
} from "@kickstock/shared/components/layouts";
import { HomePage, LeaguePage } from "@kickstock/shared/components/pages";

export function getSsrElementKey(key: string): React.ReactNode {
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
    default:
      return <>Not Found</>;
  }
}
