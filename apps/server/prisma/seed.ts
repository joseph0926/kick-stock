import { PrismaClient } from "@prisma/client";
import axios from "axios";

const prisma = new PrismaClient();

const BASE_URL =
  process.env.NODE_ENV === "prodcution"
    ? "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn/prod"
    : "https://cdn.jsdelivr.net/gh/joseph0926/kick-stock/packages/data-cdn/dev";

const LEAGUE_INDEX_URL = `${BASE_URL}/index.json`;
const CLUB_BASE_URL = `${BASE_URL}/club`;

async function main() {
  const leagueIndexRes = await axios.get(LEAGUE_INDEX_URL);
  const leagueIndex = leagueIndexRes.data;

  for (const leagueItem of leagueIndex) {
    const createdLeague = await prisma.league.upsert({
      where: { uniqueName: leagueItem.nameShort },
      update: {},
      create: {
        name: leagueItem.name,
        nameEng: leagueItem.nameEng,
        uniqueName: leagueItem.nameShort,
        img: leagueItem.img,
      },
    });

    console.log(`Upsert league: ${leagueItem.name} (${leagueItem.nameShort})`);

    const clubJsonUrl = `${CLUB_BASE_URL}/${leagueItem.nameShort}.json`;
    try {
      const clubRes = await axios.get(clubJsonUrl);
      const clubData = clubRes.data;

      for (const clubItem of clubData) {
        const createdClub = await prisma.club.upsert({
          where: {
            nameEng_leagueId: {
              nameEng: clubItem.nameEng,
              leagueId: createdLeague.id,
            },
          },
          update: {},
          create: {
            name: clubItem.name,
            nameEng: clubItem.nameEng,
            shortName: clubItem.shortName || clubItem.name,
            img: clubItem.img || "",
            league: clubItem.league || leagueItem.nameShort,
            leagueId: createdLeague.id,
          },
        });

        console.log(
          `Upsert club: ${clubItem.name} (${clubItem.nameEng}) in league ${leagueItem.nameShort}`
        );

        if (Array.isArray(clubItem.values)) {
          for (const val of clubItem.values) {
            await prisma.clubValue.upsert({
              where: {
                clubId_year: {
                  clubId: createdClub.id,
                  year: val.year,
                },
              },
              update: {},
              create: {
                year: val.year,
                EUR: val.EUR,
                KRW: val.KRW,
                changeRate: val.changeRate,
                clubId: createdClub.id,
              },
            });
          }
        }
      }
    } catch (err) {
      console.warn(
        `Failed to fetch club data for ${leagueItem.nameShort}, skipping...`
      );
      continue;
    }
  }

  console.log("League/Club seed completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
