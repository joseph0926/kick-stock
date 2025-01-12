import React, { Suspense } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
} from "@kickstock/ui/src/components/ui/carousel";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";
import { LeaguesCardWrapper } from "./leagues-card-wrapper";
import { HomeCardLoading } from "../shared/loading/home-card.loading";

export const LeagueList = ({
  innerTabValue,
}: {
  innerTabValue: HomeInnerTabType;
}) => {
  return (
    <div className="relative w-full">
      <Carousel className="w-full max-w-full">
        <CarouselContent className="-ml-1">
          <Suspense fallback={<HomeCardLoading />}>
            <LeaguesCardWrapper innerTabValue={innerTabValue} />
          </Suspense>
        </CarouselContent>
        <div className="flex items-center gap-2">
          <CarouselPrevious className="z-50" />
          <CarouselNext className="z-50" />
        </div>
      </Carousel>
    </div>
  );
};
