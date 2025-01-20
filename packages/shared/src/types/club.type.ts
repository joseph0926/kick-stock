export interface ClubValue {
  year: string;
  EUR: number;
  KRW: number;
  changeRate: number;
}

export interface Club {
  name: string;
  nameEng: string;
  shortName: string;
  img: string;
  league: string;
  values: ClubValue[];
}

export type ClubList = Club[];

export type TeamValue = {
  name: string;
  rawKRW: number;
  rawEUR: number;
  rawUSD: number;
  currentKRW: string;
  currentEUR: string;
  currentUSD: string;
  changeRate: number;
};

export type ClubDataResponse = {
  id: string;
  name: string;
  values: {
    clubId: string;
    id: string;
    year: string;
    EUR: number;
    KRW: number;
    changeRate: number;
  }[];
};
