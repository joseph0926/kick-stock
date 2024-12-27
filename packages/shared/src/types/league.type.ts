import { type ClubType } from "./club.type";

export type LeaguesType = {
  id: string;
  name: string;
  nameEng: string;
  clubs: ClubType[];
};

export type LeagueType = "bundes" | "epl" | "laliga" | "ligue" | "serie";

export type LeagueTabData = {
  value: LeagueType;
  label: string;
  icon?: React.ReactNode;
};