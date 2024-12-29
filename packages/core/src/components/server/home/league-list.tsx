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

type LeagueListProps = {
  leaguesData?: LeaguesDataType[];
};

export const LeagueList = ({ leaguesData }: LeagueListProps) => {
  return (
    <Carousel className="w-full max-w-4xl">
      <CarouselContent className="-ml-1">
        {leaguesData?.map((league) => (
          <CarouselItem
            key={league.id}
            className="pl-1 md:basis-1/2 lg:basis-1/4"
          >
            <Link to={`/leagues/${league.nameShort}`} className="p-1">
              <Card className="flex items-center justify-center">
                <CardContent className="flex h-40 items-center justify-center p-6">
                  <img
                    src={league.img}
                    alt={league.name}
                    className="h-full object-contain"
                  />
                </CardContent>
              </Card>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};
