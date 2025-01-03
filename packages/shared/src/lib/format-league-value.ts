import { CurrencyType } from "../types/common.type";
import {
  FormatedLeaguesValueType,
  LeaguesValueType,
} from "../types/league.type";
import { formatCurrency } from "./format-currency";

export function formatLeagueValue(
  leagueValue: LeaguesValueType,
  selectedCurrency: CurrencyType = "KRW"
): FormatedLeaguesValueType[] {
  return leagueValue.data.map((league) => ({
    name: league.name,
    values: league.values.map((yearData) => ({
      year: yearData.year,
      value: formatCurrency(yearData[selectedCurrency], selectedCurrency),
      rawValue: yearData[selectedCurrency],
    })),
  }));
}
