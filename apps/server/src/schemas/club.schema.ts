import { Type } from "@sinclair/typebox";

export const ClubItemSchema = Type.Object({
  name: Type.String(),
  nameEng: Type.String(),
  shortName: Type.String(),
  img: Type.String(),
  league: Type.String(),
  values: Type.Array(
    Type.Object({
      year: Type.String(),
      EUR: Type.Number(),
      KRW: Type.Number(),
      changeRate: Type.Number(),
    })
  ),
});

export const ClubsHistorySchema = Type.Array(ClubItemSchema);

export const ClubRealTimeSchema = Type.Array(
  Type.Object({
    id: Type.String(),
    KRW: Type.Number(),
    EUR: Type.Number(),
    timestamp: Type.String(),
    changeRate: Type.Number(),
    clubId: Type.String(),
  })
);

export type ClubItemType = {
  name: string;
  nameEng: string;
  shortName: string;
  img: string;
  league: string;
  values: {
    year: string;
    EUR: number;
    KRW: number;
    changeRate: number;
  }[];
};

export type ClubsHistoryType = ClubItemType[];

export type ClubRealTimeType = {
  id: string;
  KRW: number;
  EUR: number;
  timestamp: string;
  changeRate: number;
  clubId: string;
}[];
