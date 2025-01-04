import { CarouselItem } from "@kickstock/ui/src/components/ui/carousel";
import { Link } from "react-router";
import React from "react";
import { Card } from "@kickstock/ui/src/components/ui/card";
import { Skeleton } from "@kickstock/ui/src/components/ui/skeleton";

export const HomeCardLoading = () => {
  const skeletonItems = React.useMemo(() => Array.from({ length: 5 }), []);

  return (
    <>
      {skeletonItems.map((_, idx) => (
        <CarouselItem
          key={idx}
          className="pl-1 sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5"
        >
          <Link to="#" className="p-1">
            <Card className="flex flex-col items-center gap-4 p-2">
              <Skeleton className="flex h-72 items-center gap-4 p-2 px-8" />
            </Card>
          </Link>
        </CarouselItem>
      ))}
    </>
  );
};
