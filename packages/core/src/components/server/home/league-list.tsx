import React from "react";
import { LeaguesDataType } from "@kickstock/shared/src/types/league.type";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@kickstock/ui/src/components/ui/carousel";
import { Card, CardContent } from "@kickstock/ui/src/components/ui/card";
import { Link } from "react-router";
import { LeagueCard } from "../../client/home/league-card";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { getLeaguesData } from "../../../services/league.service";

export const LeagueList = () => {
  const { data: leaguesData } = useQuery({
    queryKey: QUERY_KEY.LEAGUE,
    queryFn: getLeaguesData,
    staleTime: Infinity,
  });

  return (
    <div className="relative w-full">
      <Carousel className="w-full max-w-full">
        <CarouselContent className="-ml-1">
          {leaguesData?.map((league) => (
            <CarouselItem
              key={league.id}
              className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <Link to={`/leagues/${league.nameShort}`} className="p-1">
                <LeagueCard league={league} />
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
