import { type ClubType } from "./club.type";

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
  EUR: number;
  USD: number;
  KRW: number;
};
export type MarketValueType = {
  name: LeagueType;
  values: CurrencyValueType[];
};
export type LeaguesMarketValueType = {
  data: MarketValueType[];
  metadata: {
    exchange_rates: {
      EUR_to_USD: number;
      EUR_to_KRW: number;
    };
  };
};
