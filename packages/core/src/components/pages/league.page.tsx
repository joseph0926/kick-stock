import { LeagueType } from "@kickstock/shared/src/types/league.type";
import React, { Suspense } from "react";
import { useParams } from "react-router";
import { LeagueWrapper } from "../shared/league/league-wrapper";
import { NotFoundPage } from "../shared/error/not-found";
import { LeagueLoading } from "../shared/loading/league.loading";

export const LeaguePage = () => {
  const params = useParams<{ leagueId: LeagueType }>();

  if (!params.leagueId) {
    return (
      <div className="p-4">
        <NotFoundPage />
      </div>
    );
  }
  return (
    <div>
      <Suspense fallback={<LeagueLoading />}>
        <LeagueWrapper league={params.leagueId} />
      </Suspense>
    </div>
  );
};
