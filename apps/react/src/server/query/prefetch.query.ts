import { dehydrate } from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import {
  getLeagueBasic,
  getLeagueClubs,
  getLeaguesData,
} from "@kickstock/core/src/services/league.service";
import { makeQueryClient } from "@kickstock/core/src/providers/query.provider";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { ROUTER } from "@kickstock/shared/src/constants/router";
import { getClubsHistoryData } from "@kickstock/core/src/services/club.service";

type RouteParams = {
  leagueId: LeagueType;
};

type RoutePattern = {
  pattern: RegExp;
  paramNames: (keyof RouteParams)[];
  validate?: (params: Partial<RouteParams>) => boolean;
};

type RouteMatch = {
  type: keyof typeof ROUTER;
  params: Partial<RouteParams>;
};

const leagues: LeagueType[] = ["bundes", "epl", "laliga", "ligue", "serie"];

const ROUTE_PATTERNS: Record<keyof typeof ROUTER, RoutePattern> = {
  HOME: {
    pattern: new RegExp("^/$"),
    paramNames: [],
  },
  LANDING: {
    pattern: new RegExp("^/landing$"),
    paramNames: [],
  },
  SIGNIN: {
    pattern: new RegExp("^/sign-in$"),
    paramNames: [],
  },
  SIGNUP: {
    pattern: new RegExp("^/sign-up$"),
    paramNames: [],
  },
  LEAGUE: {
    pattern: new RegExp("^/league/([^/]+)$"),
    paramNames: ["leagueId"],
    validate: (params) => {
      return params.leagueId ? leagues.includes(params.leagueId) : false;
    },
  },
};

const urlMatcher = (url: string): RouteMatch | null => {
  const cleanUrl = url.replace(/\/$/, "");

  for (const [routeKey, routePattern] of Object.entries(ROUTE_PATTERNS)) {
    const matches = cleanUrl.match(routePattern.pattern);

    if (matches) {
      const params = routePattern.paramNames.reduce<Partial<RouteParams>>(
        (acc, paramName, index) => {
          const value = matches[index + 1];

          switch (paramName) {
            case "leagueId":
              if (value && typeof value === "string") {
                acc[paramName] = value as LeagueType;
              }
              break;
          }
          return acc;
        },
        {},
      );

      if (routePattern.validate && !routePattern.validate(params)) {
        continue;
      }

      return {
        type: routeKey as keyof typeof ROUTER,
        params,
      };
    }
  }

  return null;
};

export async function prefetchQuery(url: string) {
  const match = urlMatcher(url);
  if (!match) return { prefetchQueries: null };

  const queryClient = makeQueryClient();

  switch (match.type) {
    case "HOME":
      await Promise.all([
        queryClient.prefetchQuery({
          queryKey: QUERY_KEY.LEAGUE.DEFAULT,
          queryFn: getLeaguesData,
          staleTime: Infinity,
        }),
        ...leagues.map((league) =>
          queryClient.prefetchQuery({
            queryKey: QUERY_KEY.CLUB.STOCK(league),
            queryFn: () => getClubsHistoryData(league),
            staleTime: Infinity,
          }),
        ),
      ]);
      break;

    case "LEAGUE":
      if (match.params.leagueId) {
        const { leagueId } = match.params;
        await Promise.all([
          queryClient.prefetchQuery({
            queryKey: QUERY_KEY.LEAGUE.BASIC(leagueId),
            queryFn: () => getLeagueBasic(leagueId),
            staleTime: Infinity,
          }),
          queryClient.prefetchQuery({
            queryKey: QUERY_KEY.LEAGUE.CLUBS(leagueId),
            queryFn: () => getLeagueClubs(leagueId),
            staleTime: 5 * 60 * 1000,
          }),
        ]);
      }
      break;
  }

  return { prefetchQueries: dehydrate(queryClient) };
}
