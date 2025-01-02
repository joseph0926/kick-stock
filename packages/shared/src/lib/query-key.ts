const DOMAIN = {
  LEAGUE: {
    DEFAULT: "league",
    MARKET_VALUE: "marketValue",
  },
};

export const QUERY_KEY = {
  LEAGUE: {
    DEFAULT: [DOMAIN.LEAGUE.DEFAULT],
    MARKET_VALUE: [DOMAIN.LEAGUE.MARKET_VALUE],
  },
} as const;
