import { LeagueUniqueName } from "@prisma/client";
import { Type, Static } from "@sinclair/typebox";

export const ClubSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  nameEng: Type.String(),
  league: Type.String(),
  img: Type.String(),
  shortName: Type.String(),
});

export const LeagueValueSchema = Type.Object({
  id: Type.String(),
  year: Type.String(),
  KRW: Type.Number(),
  changeRate: Type.Number(),
  leagueId: Type.String(),
});

export const LeagueBasicSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  nameEng: Type.String(),
  uniqueName: Type.Enum(LeagueUniqueName),
  img: Type.String(),
  values: Type.Array(LeagueValueSchema),
});

export const LeagueClubsSchema = Type.Object({
  id: Type.String(),
  uniqueName: Type.Enum(LeagueUniqueName),
  clubs: Type.Array(ClubSchema),
});

export const LeaguesSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  nameEng: Type.String(),
  uniqueName: Type.Enum(LeagueUniqueName),
  img: Type.String(),
  values: Type.Array(LeagueValueSchema),
  clubs: Type.Optional(Type.Array(ClubSchema)),
});

export const LeagueRealTimeValueSchema = Type.Object({
  id: Type.String(),
  leagueId: Type.String(),

  KRW: Type.Number(),

  timestamp: Type.String(),
  changeRate: Type.Number(),
});

export const LeagueRealTimeSchema = Type.Array(LeagueRealTimeValueSchema);

export type ClubType = Static<typeof ClubSchema>;
export type LeagueValueType = Static<typeof LeagueValueSchema>;

export type LeagueBasicType = Static<typeof LeagueBasicSchema>;
export type LeagueClubsType = Static<typeof LeagueClubsSchema>;
export type LeaguesType = Static<typeof LeaguesSchema>;

export type LeagueRealTimeValueType = Static<typeof LeagueRealTimeValueSchema>;
export type LeagueRealTimeType = Static<typeof LeagueRealTimeSchema>;
