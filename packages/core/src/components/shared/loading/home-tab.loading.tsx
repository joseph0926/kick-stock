import React from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@kickstock/ui/src/components/ui/tabs";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";
import { HomeCardLoading } from "./home-card.loading";
import {
  Carousel,
  CarouselContent,
  CarouselPrevious,
  CarouselNext,
} from "@kickstock/ui/src/components/ui/carousel";

export const HomeTabLoading = () => {
  const skeletonItems = React.useMemo(() => Array.from({ length: 3 }), []);

  return (
    <Tabs className="px-2 pt-8">
      <TabsList className="relative bg-transparent">
        {skeletonItems.map((_, idx) => (
          <TabsTrigger
            key={idx}
            value=""
            className="w-30 rounded-none text-center text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
          >
            <Skeleton className="h-9 w-24" />
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="relative w-full">
        <Carousel className="w-full max-w-full">
          <CarouselContent className="-ml-1">
            <HomeCardLoading />
          </CarouselContent>
          <div className="flex items-center gap-2">
            <CarouselPrevious className="z-50" />
            <CarouselNext className="z-50" />
          </div>
        </Carousel>
      </div>
    </Tabs>
  );
};
