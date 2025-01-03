import { cdnCachePurge } from "./api";

export const cachePurgeLeaguesValue = async (data: string) => {
  return cdnCachePurge.get(`/leagues/${data}-value.json`);
};
