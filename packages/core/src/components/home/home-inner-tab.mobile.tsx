import React, { memo, useCallback } from "react";
import {
  homeClubTab,
  homeLeagueTab,
} from "@kickstock/shared/src/constants/home/home-tab";
import {
  Tabs,
  TabsList,
  TabsTrigger,
} from "@kickstock/ui/src/components/ui/tabs";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@kickstock/ui/src/components/ui/select";
import { useUrlContext } from "../../hooks/use-url-context";
import { HomeTabContent } from "./home-tab-content";
import {
  HomeInnerTabType,
  HomeTabType,
} from "@kickstock/shared/src/types/common.type";
import { LeagueType } from "@kickstock/shared/src/types/league.type";

type HomeInnerTabProps = {
  outerTabValue: HomeTabType;
};

export const HomeInnerTabMobile = memo(
  ({ outerTabValue }: HomeInnerTabProps) => {
    const { onUpdateSearchParams, searchParams } = useUrlContext();
    const indicator = searchParams.get("indicator") as
      | HomeInnerTabType
      | LeagueType;

    const getTabValue = useCallback(() => {
      switch (outerTabValue) {
        case "all":
          return homeLeagueTab;
        case "club":
          return homeClubTab;
        case "player":
          return [];
        default:
          return homeLeagueTab;
      }
    }, [outerTabValue]);

    const innerTabValue = getTabValue();
    const fallbackSelectValue = innerTabValue[0].value;
    const fallbackSelectPlaceholder = innerTabValue[0].label;

    return (
      <Tabs>
        <TabsList className="relative w-full gap-4 bg-transparent">
          <Select
            value={indicator ?? fallbackSelectValue}
            onValueChange={(e) =>
              onUpdateSearchParams({ indicator: e }, "update")
            }
          >
            <SelectTrigger className="py-4">
              <SelectValue placeholder={fallbackSelectPlaceholder} />
            </SelectTrigger>
            <SelectContent>
              {innerTabValue.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  <TabsTrigger
                    value={item.value}
                    className="w-24 rounded-none text-center text-lg font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none"
                  >
                    {item.label}
                  </TabsTrigger>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </TabsList>
        <HomeTabContent
          outerTabValue={outerTabValue}
          innerTabValue={indicator}
        />
      </Tabs>
    );
  },
);

HomeInnerTabMobile.displayName = "HomeInnerTabMobile";
