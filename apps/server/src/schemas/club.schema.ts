import { Type } from "@sinclair/typebox";

export const ClubHistorySchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  values: Type.Array(
    Type.Object({
      id: Type.String(),
      year: Type.String(),
      EUR: Type.Number(),
      KRW: Type.Number(),
      changeRate: Type.Number(),
    })
  ),
});

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

export type ClubHistoryType = {
  id: string;
  name: string;
  values: {
    id: string;
    year: string;
    EUR: number;
    KRW: number;
    changeRate: number;
  }[];
};

export type ClubRealTimeType = {
  id: string;
  KRW: number;
  EUR: number;
  timestamp: string;
  changeRate: number;
  clubId: string;
}[];
