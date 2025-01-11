import { CurrencyType } from "../types/common.type.js";

export function formatCurrency(
  amount: number,
  currency: CurrencyType,
  compact: boolean = false
): string {
  const isNegative = amount < 0;
  const absoluteAmount = Math.abs(amount);

  if (currency === "KRW") {
    if (absoluteAmount >= 1_000_000_000_000) {
      const trillions = absoluteAmount / 1_000_000_000_000;
      return `${isNegative ? "-" : ""}${trillions.toLocaleString("ko-KR", { maximumFractionDigits: compact ? 2 : 4 })}조`;
    }

    if (absoluteAmount >= 100_000_000) {
      const billions = Math.floor(absoluteAmount / 100_000_000);
      return `${isNegative ? "-" : ""}${billions.toLocaleString("ko-KR")}억`;
    }

    if (absoluteAmount >= 10_000_000) {
      const tenMillions = Math.floor(absoluteAmount / 10_000_000) * 1000;
      return `${isNegative ? "-" : ""}${tenMillions.toLocaleString("ko-KR")}만`;
    }

    if (absoluteAmount >= 1_000_000) {
      const millions = Math.floor(absoluteAmount / 1_000_000) * 100;
      return `${isNegative ? "-" : ""}${millions.toLocaleString("ko-KR")}만`;
    }

    return `${isNegative ? "-" : ""}${Math.floor(absoluteAmount).toLocaleString("ko-KR")}`;
  }

  const currencySymbol = currency === "EUR" ? "€" : "$";

  if (absoluteAmount >= 1_000_000_000) {
    const billions = absoluteAmount / 1_000_000_000;
    return `${isNegative ? "-" : ""}${currencySymbol}${billions.toLocaleString("en-US", { maximumFractionDigits: 2 })}B`;
  }

  if (absoluteAmount >= 1_000_000) {
    const millions = absoluteAmount / 1_000_000;
    return `${isNegative ? "-" : ""}${currencySymbol}${millions.toLocaleString("en-US", { maximumFractionDigits: 2 })}M`;
  }

  if (absoluteAmount >= 1_000) {
    const thousands = absoluteAmount / 1_000;
    return `${isNegative ? "-" : ""}${currencySymbol}${thousands.toLocaleString("en-US", { maximumFractionDigits: 2 })}K`;
  }

  return `${isNegative ? "-" : ""}${currencySymbol}${Math.floor(absoluteAmount).toLocaleString("en-US")}`;
}
