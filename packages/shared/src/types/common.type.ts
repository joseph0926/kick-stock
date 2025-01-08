export type CurrencyType = "EUR" | "USD" | "KRW";

export type HomeTabType = "all" | "club" | "player";
export type HomeInnerTabType = "index" | "revenue" | "profit";

export type ApiResponse<T = any[]> = {
  data: T | null;
  success: boolean;
  message?: string;
};
