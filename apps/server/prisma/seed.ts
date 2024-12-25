import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

interface LeagueData {
  id: string;
  name: string;
  nameEng: string;
  clubs: {
    id: string;
    name: string;
    nameEng: string;
    league: string;
    img: string;
    shortName: string;
  }[];
}

const LEAGUES = ["laliga", "epl", "bundes", "ligue", "serie"];

async function fetchLeagueData(leagueName: string): Promise<LeagueData> {
  const response = await axios.get<LeagueData>(
    `https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn/leagues/${leagueName}.json`
  );
  return response.data;
}

async function main() {
  try {
    await prisma.club.deleteMany();
    await prisma.league.deleteMany();

    for (const leagueName of LEAGUES) {
      console.log(`Processing ${leagueName}...`);
      const data = await fetchLeagueData(leagueName);

      const league = await prisma.league.create({
        data: {
          name: data.name,
          nameEng: data.nameEng,
        },
      });

      await prisma.club.createMany({
        data: data.clubs.map((club) => ({
          name: club.name,
          nameEng: club.nameEng,
          shortName: club.shortName,
          img: club.img,
          league: club.league,
          leagueId: league.id,
        })),
        skipDuplicates: true,
      });

      console.log(`Completed ${leagueName}: Added ${data.clubs.length} clubs`);
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
