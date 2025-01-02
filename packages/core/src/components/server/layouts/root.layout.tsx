import React from "react";
import { Outlet, useLoaderData } from "react-router";
import { NavbarServer } from "./navbar.server";
import { UrlContextProvider } from "../../../providers/url.context";
import {
  dehydrate,
  DehydratedState,
  HydrationBoundary,
} from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import {
  getLeaguesData,
  getLeaguesMarketValue,
} from "../../../services/league.service";
import { makeQueryClient } from "../../../providers/query.provider";

export async function loader() {
  const queryClient = makeQueryClient();

  await queryClient.prefetchQuery({
    queryKey: QUERY_KEY.LEAGUE.DEFAULT,
    queryFn: getLeaguesData,
    staleTime: Infinity,
  });
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEY.LEAGUE.MARKET_VALUE,
    queryFn: getLeaguesMarketValue,
    staleTime: Infinity,
  });

  return { leaguesQuery: dehydrate(queryClient) };
}

export function RootLayout() {
  const leaguesLoaderData = useLoaderData<{
    leaguesQuery: DehydratedState;
  }>();

  return (
    <HydrationBoundary state={leaguesLoaderData?.leaguesQuery}>
      <UrlContextProvider>
        <div className="flex min-h-screen w-full items-center">
          <NavbarServer />
          <Outlet />
        </div>
      </UrlContextProvider>
    </HydrationBoundary>
  );
}
