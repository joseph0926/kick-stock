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
  getLeaguesMarketValue,
} from "../../../services/league.service";
import { LeagueType } from "@kickstock/shared/src/types/league.type";

export const LeagueList = () => {
  const { data: leaguesData } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.DEFAULT,
    queryFn: getLeaguesData,
    staleTime: Infinity,
  });
  const { data: leaguesMarketValue } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.MARKET_VALUE,
    queryFn: getLeaguesMarketValue,
    staleTime: Infinity,
  });

  const getLeagueMarketValue = useCallback((league: LeagueType) => {
    return leaguesMarketValue.data.find(
      (marketValue) => marketValue.name === league,
    );
  }, []);

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
                  markeyValue={getLeagueMarketValue(league.nameShort)}
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
