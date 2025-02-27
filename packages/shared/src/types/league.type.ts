import { type ClubType } from "./club.type.js";
import { type CurrencyType } from "./common.type.js";
import { type ValuesType } from "./prisma.type.js";

export type LeagueType = "bundes" | "epl" | "laliga" | "ligue" | "serie";

export type LeaguesDataType = {
  id: string;
  name: string;
  nameShort: LeagueType;
  nameEng: string;
  img: string;
};

export type LeaguesType = LeaguesDataType & {
  clubs: ClubType[];
  values: ValuesType[];
};

export type LeagueTabData = {
  value: LeagueType;
  label: string;
  icon?: React.ReactNode;
};
export type CurrencyValueType = {
  year: string;
} & { [key in CurrencyType]: number };
export type LeaguesValueDataType = {
  name: LeagueType;
  values: CurrencyValueType[];
};
export type LeaguesValueType = {
  data: LeaguesValueDataType[];
  metadata: {
    exchange_rates: {
      EUR_to_USD: number;
      EUR_to_KRW: number;
    };
  };
};

export type FormatedLeaguesValueType = {
  name: LeagueType;
  values: {
    year: string;
    value: string;
    rawValue: number;
  }[];
};
