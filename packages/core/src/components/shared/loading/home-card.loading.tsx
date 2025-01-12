import React from "react";
import { CarouselItem } from "@kickstock/ui/src/components/ui/carousel";
import { Link } from "react-router";
import { Card } from "@kickstock/ui/src/components/ui/card";

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
            <Card className="flex h-[274px] w-full flex-col items-center gap-4 p-2" />
          </Link>
        </CarouselItem>
      ))}
    </>
  );
};
