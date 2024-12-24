import { clubStocks } from "@/data/dummy-club.data";
import { Card } from "../ui/card";

export const StocTopkList = () => {
  return (
    <div className="flex items-center gap-2">
      {clubStocks.map((club, idx) => (
        <Card key={idx} cardType="box" label={club.name}>
          <div className="flex items-center gap-2.5">
            <img
              src={club.img}
              alt={club.name}
              className="size-5 rounded-full"
            />
            <h1 className="font-bold text-sm">{club.shortName}</h1>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-medium text-base">{club.price}</span>
            <span className="text-xs">{club.rate}</span>
          </div>
        </Card>
      ))}
    </div>
  );
};
