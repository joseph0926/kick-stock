import { apiAxios } from "./api";

export const getMonthlyStockData = async (symbol: string) => {
  const { data } = await apiAxios.get("/stock", {
    params: {
      fn: "TIME_SERIES_MONTHLY_ADJUSTED",
      symbol,
    },
  });

  return data;
};
