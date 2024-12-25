export type ClubType = {
  id: string;
  name: string;
  nameEng: string;
  league: string;
  img: string;
  shortName: string;
};

export type LeaguesType = {
  id: string;
  name: string;
  nameEng: string;
  clubs: ClubType[];
};
