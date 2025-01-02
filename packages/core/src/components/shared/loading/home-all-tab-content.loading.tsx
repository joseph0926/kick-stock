import React from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@kickstock/ui/src/components/ui/carousel";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";

export const HomeAllTabContentLoading = () => {
  const skeletonItems = React.useMemo(() => Array.from({ length: 5 }), []);

  return (
    <div className="relative w-full">
      <Carousel className="w-full max-w-full">
        <CarouselContent className="-ml-1">
          {skeletonItems.map((_, idx) => (
            <CarouselItem
              key={idx}
              className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
            >
              <div className="p-1">
                <Skeleton className="flex h-72 items-center gap-4 p-2 px-8 py-10" />
              </div>
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
