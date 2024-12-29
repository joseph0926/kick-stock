import React from "react";
import { useLoaderData, useRouteLoaderData } from "react-router";

export function HomePage() {
  const loaderData = useRouteLoaderData("root");

  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 sm:px-6 md:px-10">
      {JSON.stringify(loaderData, null, 2)}
    </div>
  );
}
