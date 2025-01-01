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
import { cn } from "@kickstock/ui/src/lib/utils";

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
                <Card className="flex items-center justify-center bg-muted-foreground dark:bg-muted">
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
    </div>
  );
};
