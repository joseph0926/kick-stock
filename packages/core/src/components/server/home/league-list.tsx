import React, { useCallback } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@kickstock/ui/src/components/ui/carousel";
import { Link } from "react-router";
import { LeagueCard } from "../../client/home/league-card";
import { useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import {
  getLeaguesData,
  getLeaguesRevenueValue,
  getLeaguesProfitValue,
  getLeaguesIndexValue,
} from "../../../services/league.service";
import { LeagueType } from "@kickstock/shared/src/types/league.type";
import { formatLeagueValue } from "@kickstock/shared/src/lib/format-league-value";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";

export const LeagueList = ({
  innerTabValue,
}: {
  innerTabValue: HomeInnerTabType;
}) => {
  const { data: leaguesData } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.DEFAULT,
    queryFn: getLeaguesData,
    staleTime: Infinity,
  });
  const { data: leaguesRevenueValue } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.REVENUE_VALUE,
    queryFn: getLeaguesRevenueValue,
    staleTime: Infinity,
    select: (data) => formatLeagueValue(data),
  });
  const { data: leaguesProfitValue } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.PROFIT_VALUE,
    queryFn: getLeaguesProfitValue,
    staleTime: Infinity,
    select: (data) => formatLeagueValue(data),
  });
  const { data: leaguesIndexValue } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.INDEX_VALUE,
    queryFn: getLeaguesIndexValue,
    staleTime: Infinity,
    select: (data) => formatLeagueValue(data),
  });

  const getLeagueValue = useCallback(
    (league: LeagueType) => {
      switch (innerTabValue) {
        case "index":
          return leaguesIndexValue.find(
            (leagueValue) => leagueValue.name === league,
          );
        case "revenue":
          return leaguesRevenueValue.find(
            (leagueValue) => leagueValue.name === league,
          );
        case "profit":
          return leaguesProfitValue.find(
            (leagueValue) => leagueValue.name === league,
          );
        default:
          return undefined;
      }
    },
    [innerTabValue],
  );

  return (
    <div className="relative w-full">
      <Carousel className="w-full max-w-full">
        <CarouselContent className="-ml-1">
          {leaguesData.map((league) => (
            <CarouselItem
              key={league.id}
              className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <Link to={`/leagues/${league.nameShort}`} className="p-1">
                <LeagueCard
                  league={league}
                  leagueValue={getLeagueValue(league.nameShort)}
                  innerTabValue={innerTabValue}
                />
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center gap-2">
          <CarouselPrevious className="z-50" />
          <CarouselNext className="z-50" />
        </div>
      </Carousel>
    </div>
  );
};
