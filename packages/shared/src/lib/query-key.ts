import { LeagueType } from "../types/league.type";

const DOMAIN = {
  LEAGUE: {
    DEFAULT: "league",
    INDEX_VALUE: "indexValue",
    REVENUE_VALUE: "revenuValue",
    PROFIT_VALUE: "profitValue",
  },
  CLUB: {
    DEFAULT: "club",
    STOCK: "clubStock",
  },
};

export const QUERY_KEY = {
  LEAGUE: {
    DEFAULT: [DOMAIN.LEAGUE.DEFAULT],
    INDEX_VALUE: [DOMAIN.LEAGUE.INDEX_VALUE],
    REVENUE_VALUE: [DOMAIN.LEAGUE.REVENUE_VALUE],
    PROFIT_VALUE: [DOMAIN.LEAGUE.PROFIT_VALUE],
  },
  CLUB: {
    DEFAULT: [DOMAIN.CLUB.DEFAULT],
    STOCK: (league: LeagueType) => [DOMAIN.CLUB.STOCK, league],
  },
} as const;
