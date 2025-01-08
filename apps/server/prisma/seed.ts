import { LeagueUniqueName, PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

interface LeagueData {
  id: string;
  name: string;
  nameEng: string;
  uniqueName: LeagueUniqueName;
  img: string;
  clubs: {
    id: string;
    name: string;
    nameEng: string;
    league: string;
    img: string;
    shortName: string;
  }[];
}

interface ClubValueData {
  name: string;
  values: {
    year: string;
    EUR: number;
    USD: number;
    KRW: number;
    changeRate: number;
  }[];
}

interface ValueData {
  data: ClubValueData[];
}

const LEAGUES = ["laliga", "epl", "bundes", "ligue", "serie"];

async function fetchLeagueData(leagueName: string): Promise<LeagueData> {
  const response = await axios.get<LeagueData>(
    `https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn/leagues/club/${leagueName}.json`
  );
  return response.data;
}

async function fetchClubValueData(leagueName: string): Promise<ValueData> {
  const response = await axios.get<ValueData>(
    `https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn/club/2024/${leagueName}.json`
  );
  return response.data;
}

async function main() {
  try {
    await prisma.clubValue.deleteMany();
    await prisma.club.deleteMany();
    await prisma.league.deleteMany();

    for (const leagueName of LEAGUES) {
      console.log(`Processing ${leagueName}...`);

      const leagueData = await fetchLeagueData(leagueName);

      const league = await prisma.league.create({
        data: {
          id: leagueData.id,
          name: leagueData.name,
          nameEng: leagueData.nameEng,
          uniqueName: leagueData.uniqueName,
          img: leagueData.img,
        },
      });

      for (const club of leagueData.clubs) {
        await prisma.club.create({
          data: {
            id: club.id,
            name: club.name,
            nameEng: club.nameEng,
            shortName: club.shortName,
            img: club.img,
            league: club.league,
            leagueId: league.id,
          },
        });
      }

      const valueData = await fetchClubValueData(leagueName);

      for (const clubValueData of valueData.data) {
        const club = await prisma.club.findFirst({
          where: {
            nameEng: {
              contains: clubValueData.name,
            },
          },
        });

        if (club) {
          await prisma.clubValue.createMany({
            data: clubValueData.values.map((value) => ({
              year: value.year,
              EUR: value.EUR,
              USD: value.USD,
              KRW: value.KRW,
              changeRate: value.changeRate,
              clubId: club.id,
            })),
          });
          console.log(`Added value data for ${club.nameEng}`);
        } else {
          console.warn(`Could not find club for ${clubValueData.name}`);
        }
      }

      console.log(`Completed ${leagueName}`);
    }

    console.log("Data seeding completed successfully");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
