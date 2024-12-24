import { clubStocks } from "@/data/dummy-club.data";
import { Card } from "../ui/card";

export const StockMidList = () => {
  return (
    <div className="w-full flex flex-col gap-2">
      {clubStocks.map((club, idx) => (
        <Card cardType="list" label={club.name} key={idx}>
          <div className="flex items-center gap-2.5">
            <img
              src={club.img}
              alt={club.name}
              className="size-6 rounded-full"
            />
            <div className="flex flex-col gap-0.5">
              <h1 className="font-bold text-base">{club.shortName}</h1>
              <p className="text-sm text-muted-foreground">{club.name}</p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1">
            <span className="font-bold text-base">{club.price}</span>
            <span className="text-sm">{club.rate}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
