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

export const LeageValueSchema = Type.Object({
  id: Type.String(),
  year: Type.String(),
  KRW: Type.Number(),
  changeRate: Type.Number(),
  leagueId: Type.String(),
});

export const LeaguesSchema = Type.Object({
  id: Type.String(),
  name: Type.String(),
  nameEng: Type.String(),
  uniqueName: Type.Enum(LeagueUniqueName),
  img: Type.String(),
  values: Type.Array(LeageValueSchema),
  clubs: Type.Optional(Type.Array(ClubSchema)),
});

export type ValuesType = Static<typeof LeageValueSchema>;
export type ClubType = Static<typeof ClubSchema>;
export type LeaguesType = Static<typeof LeaguesSchema>;
