import { Socket } from "socket.io";
import { BaseSocketHandler } from "./base.handler.js";

type UpdateClubValueData = {
  clubId: string;
  year: string;
  KRW: number;
};

export class ClubSocketHandler extends BaseSocketHandler {
  private async getClubValue(clubId: string, year: string) {
    if (this.clubCache) {
      const cachedValue = await this.clubCache.getClubValue(clubId, year);
      if (cachedValue) return cachedValue;
    }

    const dbValue = await this.prisma.clubValue.findFirst({
      where: {
        AND: [{ clubId }, { year }],
      },
    });

    if (dbValue && this.clubCache) {
      await this.clubCache.setClubValue(clubId, year, dbValue);
    }

    return dbValue;
  }

  private async updateClubValue(data: UpdateClubValueData) {
    const updatedValue = await this.prisma.clubValue
      .updateMany({
        where: {
          AND: [{ clubId: data.clubId }, { year: data.year }],
        },
        data: {
          KRW: data.KRW,
          EUR: data.KRW / 1400,
          USD: data.KRW / 1300,
          changeRate: 0,
        },
      })
      .then(() =>
        this.prisma.clubValue.findFirst({
          where: {
            AND: [{ clubId: data.clubId }, { year: data.year }],
          },
          include: {
            club: true,
          },
        })
      );

    if (!updatedValue) {
      throw new Error("Club value not found after update");
    }

    if (this.clubCache) {
      await this.clubCache.setClubValue(data.clubId, data.year, updatedValue);
    }

    return updatedValue;
  }

  registerHandlers(socket: Socket): void {
    socket.on(
      "requestClubValue",
      async (data: { clubId: string; year: string }) => {
        try {
          const clubValue = await this.getClubValue(data.clubId, data.year);
          socket.emit("clubValueResponse", clubValue);
        } catch (error) {
          this.fastify.log.error("[server]: club value 조회 실패:", error);
          socket.emit("error", "club value 조회 실패");
        }
      }
    );

    socket.on("updateClubValue", async (data: UpdateClubValueData) => {
      try {
        const updatedValue = await this.updateClubValue(data);
        this.io.emit("clubValueUpdated", {
          clubId: data.clubId,
          updatedValue,
        });
      } catch (error) {
        this.fastify.log.error("[server]: club value 업데이트 실패:", error);
        socket.emit("error", "club value 업데이트 실패");
      }
    });
  }
}
