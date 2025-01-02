import { cdnCachePurge } from "./api";

export const cachePurgeLeaguesMarketValue = async () => {
  return cdnCachePurge.get("/leagues/market-value.json");
};
