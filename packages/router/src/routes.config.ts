interface IndexRouteMeta {
  routeKey: string;
  index: true;
  path?: never;
  children?: never;
}

interface PathRouteMeta {
  routeKey: string;
  index?: false;
  path: string;
  children?: RouteMeta[];
}

export type RouteMeta = IndexRouteMeta | PathRouteMeta;

export const routeDefinitions: RouteMeta[] = [
  {
    path: "/",
    routeKey: "rootLayout",
    children: [
      { index: true, routeKey: "homePage" },
      { path: "league", routeKey: "leaguePage" },
      {
        path: "club",
        routeKey: "clubLayout",
        children: [{ path: ":clubId", routeKey: "clubPage" }],
      },
    ],
  },
  {
    path: "/auth",
    routeKey: "authLayout",
    children: [
      { path: "sign-in", routeKey: "signInPage" },
      { path: "sign-up", routeKey: "signUpPage" },
    ],
  },
  {
    path: "/landing",
    routeKey: "landingPage",
  },
];
