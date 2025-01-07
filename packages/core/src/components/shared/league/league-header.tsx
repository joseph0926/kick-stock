import React from "react";

type LeagueHeaderProps = {
  name: string;
  img: string;
};

export const LeagueHeader = ({ name, img }: LeagueHeaderProps) => {
  return (
    <div className="flex items-center justify-start gap-4">
      <div className="size-20 rounded-lg bg-border">
        <img src={img} alt={name} className="size-full p-4" />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-xl font-bold">{name}</span>
      </div>
    </div>
  );
};
