import { StockMidList } from "@/components/stock/stock-mid-list";
import { StocTopkList } from "@/components/stock/stock-top-list";

export function HomePage() {
  return (
    <div className="flex flex-col items-center px-4 md:px-10 sm:px-6 w-full gap-6">
      <StocTopkList />
      <StockMidList />
    </div>
  );
}
