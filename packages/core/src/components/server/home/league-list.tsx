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

type LeagueListProps = {
  leaguesData?: LeaguesDataType[];
};

export const LeagueList = ({ leaguesData }: LeagueListProps) => {
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
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};
