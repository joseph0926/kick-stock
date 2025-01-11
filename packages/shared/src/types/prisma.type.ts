import { LeagueType } from "./league.type.js";

export type ValuesType = {
  id: string;
  year: string;
  KRW: number;
  changeRate: number;
  leagueId: string;
  timestamp: number;
};

export type League = {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  nameEng: string;
  img: string;
  uniqueName: LeagueType;
};

export type ClubValue = {
  id: string;
  year: string;
  EUR: number;
  USD: number;
  KRW: number;
  changeRate: number;
  clubId: string;
};

export type Club = {
  name: string;
  id: string;
  createdAt: Date;
  updatedAt: Date;
  nameEng: string;
  shortName: string;
  img: string;
  league: string;
  leagueId: string;
};
