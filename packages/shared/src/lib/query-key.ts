import { LeagueType } from "../types/league.type.js";

const DOMAIN = {
  LEAGUE: {
    DEFAULT: "league",
    INDEX_VALUE: "indexValue",
    REVENUE_VALUE: "revenueValue",
    PROFIT_VALUE: "profitValue",
    BASIC: "basic",
    CLUBS: "clubs",
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
    BASIC: (league: LeagueType) => [
      DOMAIN.LEAGUE.DEFAULT,
      league,
      DOMAIN.LEAGUE.BASIC,
    ],
    CLUBS: (league: LeagueType) => [
      DOMAIN.LEAGUE.DEFAULT,
      league,
      DOMAIN.LEAGUE.CLUBS,
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
