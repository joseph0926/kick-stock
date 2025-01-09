import { ClubType } from "./club.type";

export type LeagueValueType = {
  id: string;
  year: string;
  KRW: number;
  changeRate: number;
  leagueId: string;
};
export type LeagueBasicType = {
  name: string;
  id: string;
  nameEng: string;
  uniqueName: "bundes" | "epl" | "laliga" | "ligue" | "serie";
  img: string;
  values: LeagueValueType[];
};

export type LeagueClubsType = {
  id: string;
  uniqueName: "bundes" | "epl" | "laliga" | "ligue" | "serie";
  clubs: ClubType[];
};
