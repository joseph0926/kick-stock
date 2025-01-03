import { type ClubType } from "./club.type";
import { type CurrencyType } from "./common.type";

export type LeagueType = "bundes" | "epl" | "laliga" | "ligue" | "serie";

export type LeaguesDataType = {
  id: string;
  name: string;
  nameShort: LeagueType;
  nameEng: string;
  img: string;
};

export type LeaguesType = {
  id: string;
  name: string;
  nameEng: string;
  clubs: ClubType[];
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
