export type LeagueValueData = {
  leagueId: string;
  KRW: number;
  timestamp: Date;
  changeRate: number;
};

export type CacheValue = {
  values: LeagueValueData[];
  lastUpdated: Date;
};
