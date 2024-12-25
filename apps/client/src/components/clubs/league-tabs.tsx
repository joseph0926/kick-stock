import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { leagues } from "@/constants/leagues";

export const LeagueTabs = () => {
  return (
    <Tabs>
      <TabsList>
        {leagues.map((league) => (
          <TabsTrigger
            key={league}
            value={league}
            className="uppercase text-sm font-bold"
          >
            {league}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
};
