import { CurrencyType } from "../types/common.type";
import {
  FormatedLeaguesMarketValueType,
  LeaguesMarketValueType,
} from "../types/league.type";
import { formatCurrency } from "./format-currency";

export function formatMarketValue(
  marketValue: LeaguesMarketValueType,
  selectedCurrency: CurrencyType = "KRW"
): FormatedLeaguesMarketValueType[] {
  return marketValue.data.map((league) => ({
    name: league.name,
    values: league.values.map((yearData) => ({
      year: yearData.year,
      value: formatCurrency(yearData[selectedCurrency], selectedCurrency),
      rawValue: yearData[selectedCurrency],
    })),
  }));
}
