import { StockMidList } from "@/components/stock/stock-mid-list";
import { StocTopkList } from "@/components/stock/stock-top-list";

export function HomePage() {
  return (
    <div className="flex w-full flex-col items-center gap-6 px-4 sm:px-6 md:px-10">
      <StocTopkList />
      <StockMidList />
    </div>
  );
}
