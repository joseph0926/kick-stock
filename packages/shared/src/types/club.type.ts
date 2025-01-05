import { CurrencyType } from "./common.type";

export type ClubType = {
  id: string;
  name: string;
  nameEng: string;
  league: string;
  img: string;
  shortName: string;
};

export type ClubStockValueType = {
  year: string;
} & { [key in CurrencyType]: number };
export type ClubStockDataType = {
  name: string;
  values: ClubStockValueType[];
};
export type ClubStockType = {
  data: ClubStockDataType[];
};

export type TeamValue = {
  name: string;
  currentEUR: number;
  currentUSD: number;
  currentKRW: number;
};
