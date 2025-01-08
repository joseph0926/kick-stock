import { CurrencyType } from "./common.type.js";

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
  changeRate: number;
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
  rawEUR: number;
  rawUSD: number;
  rawKRW: number;
  currentEUR: string;
  currentUSD: string;
  currentKRW: string;
  changeRate: number;
};
