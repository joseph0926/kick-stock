import React from "react";
import { QUERY_KEY } from "@kickstock/shared/src/lib/query-key";
import { useSuspenseQuery } from "@tanstack/react-query";
import { getLeaguesData } from "../../services/league.service";
import { CarouselItem } from "@kickstock/ui/src/components/ui/carousel";
import { LeagueCard } from "../home/league-card";
import { Link } from "react-router";
import { HomeInnerTabType } from "@kickstock/shared/src/types/common.type";

export const LeaguesCardWrapper = ({
  innerTabValue,
}: {
  innerTabValue: HomeInnerTabType;
}) => {
  const { data: leaguesData } = useSuspenseQuery({
    queryKey: QUERY_KEY.LEAGUE.DEFAULT,
    queryFn: getLeaguesData,
    staleTime: Infinity,
  });

  return (
    <>
      {leaguesData.map((league) => (
        <CarouselItem
          key={league.id}
          className="px-2 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
        >
          <Link
            to={`/league/${league.nameShort}`}
            state={{ league }}
            className="p-1"
          >
            <LeagueCard league={league} innerTabValue={innerTabValue} />
          </Link>
        </CarouselItem>
      ))}
    </>
  );
};
