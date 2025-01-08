import { LeagueType } from "../types/league.type.js";

const DOMAIN = {
  LEAGUE: {
    DEFAULT: "league",
    INDEX_VALUE: "indexValue",
    REVENUE_VALUE: "revenuValue",
    PROFIT_VALUE: "profitValue",
    DETAIL: "",
  },
  CLUB: {
    DEFAULT: "club",
    STOCK: "stock",
  },
};

export const QUERY_KEY = {
  LEAGUE: {
    DEFAULT: [DOMAIN.LEAGUE.DEFAULT],
    INDEX_VALUE: [DOMAIN.LEAGUE.DEFAULT, DOMAIN.LEAGUE.INDEX_VALUE],
    REVENUE_VALUE: [DOMAIN.LEAGUE.DEFAULT, DOMAIN.LEAGUE.REVENUE_VALUE],
    PROFIT_VALUE: [DOMAIN.LEAGUE.DEFAULT, DOMAIN.LEAGUE.PROFIT_VALUE],
    DETAIL: (leage: LeagueType, hasClub: boolean = false) => [
      DOMAIN.LEAGUE.DEFAULT,
      leage,
      hasClub,
    ],
  },
  CLUB: {
    DEFAULT: [DOMAIN.CLUB.DEFAULT],
    STOCK: (league: LeagueType) => [
      DOMAIN.CLUB.DEFAULT,
      DOMAIN.CLUB.STOCK,
      league,
    ],
  },
} as const;
