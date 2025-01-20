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

export type ClubItem = {
  name: string;
  nameEng: string;
  shortName: string;
  img: string;
  league: string;
  values: {
    year: string;
    EUR: number;
    KRW: number;
    changeRate: number;
  }[];
};

export type ClubTableType = {
  name: string;
  rawEUR: number;
  rawKRW: number;
  currentEUR: string;
  currentKRW: string;
  changeRate: number;
};
