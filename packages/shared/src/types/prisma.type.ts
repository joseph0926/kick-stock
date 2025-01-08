export type ValuesType = {
  id: string;
  year: string;
  KRW: number;
  changeRate: number;
  leagueId: string;
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
