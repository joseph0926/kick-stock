import { Socket } from "socket.io";
import { BaseSocketHandler } from "./base.handler.js";

type UpdateLeagueValueData = {
  leagueId: string;
  year: string;
  KRW: number;
};

export class LeagueSocketHandler extends BaseSocketHandler {
  private simulationIntervals: Map<string, NodeJS.Timeout> = new Map();
  private simulatedLeagues: Map<
    string,
    { leagueId: string; year: string; KRW: number }
  > = new Map();

  private async getLeagueValue(leagueId: string, year: string) {
    if (this.leagueCache) {
      const cachedValue = await this.leagueCache.getLeagueValue(leagueId, year);
      if (cachedValue) {
        return cachedValue;
      }
    }

    const dbValue = await this.prisma.leagueValue.findFirst({
      where: {
        AND: [{ leagueId }, { year }],
      },
    });

    if (dbValue && this.leagueCache) {
      await this.leagueCache.setLeagueValue(leagueId, year, dbValue);
    }

    return dbValue;
  }

  private getSimulationKey(leagueId: string, year: string): string {
    return `${leagueId}_${year}`;
  }

  private async simulateValueUpdate(
    leagueId: string,
    year: string,
    currentKRW: number
  ) {
    try {
      const minChange = -0.5;
      const maxChange = 0.5;
      const changeRate = minChange + Math.random() * (maxChange - minChange);

      const newValue = Math.round(currentKRW * (1 + changeRate / 100));

      if (newValue === currentKRW) {
        return;
      }

      const updatedValue = await this.prisma.leagueValue.update({
        where: {
          leagueId_year: {
            leagueId,
            year,
          },
        },
        data: {
          KRW: newValue,
          changeRate: Number(changeRate.toFixed(2)),
        },
        include: {
          league: true,
        },
      });

      if (this.leagueCache) {
        await this.leagueCache.setLeagueValue(leagueId, year, updatedValue);
      }

      const key = this.getSimulationKey(leagueId, year);

      this.simulatedLeagues.set(key, {
        leagueId,
        year,
        KRW: newValue,
      });

      this.io.emit("leagueValueUpdated", {
        leagueId,
        updatedValue,
      });

      if (Math.abs(changeRate) > 0.1) {
        this.fastify.log.info(
          `[server]: ${key} 시뮬레이션 업데이트 - 새 값: ${newValue}, 변화율: ${changeRate.toFixed(2)}%`
        );
      }
    } catch (error) {
      this.fastify.log.error(
        "[server]: league value 시뮬레이션 업데이트 실패:",
        error
      );
    }
  }

  private async initializeSimulation(leagueId: string, year: string) {
    try {
      const leagueValue = await this.prisma.leagueValue.findFirst({
        where: {
          AND: [{ leagueId }, { year }],
        },
        include: {
          league: true,
        },
      });

      if (leagueValue) {
        const key = this.getSimulationKey(leagueId, year);
        this.simulatedLeagues.set(key, {
          leagueId,
          year,
          KRW: leagueValue.KRW,
        });

        if (this.leagueCache) {
          await this.leagueCache.setLeagueValue(leagueId, year, leagueValue);
        }

        this.fastify.log.info(
          `[server]: 리그 ${leagueId} - ${year}년도 시뮬레이션 초기화`
        );
      }
    } catch (error) {
      this.fastify.log.error("[server]: 리그 시뮬레이션 초기화 실패:", error);
    }
  }

  private startValueSimulation(leagueId: string, year: string) {
    const key = this.getSimulationKey(leagueId, year);

    if (this.simulationIntervals.has(key)) {
      this.fastify.log.info(`[server]: ${key} 기존 시뮬레이션 중지`);
      clearInterval(this.simulationIntervals.get(key));
    }

    const interval = setInterval(async () => {
      const league = this.simulatedLeagues.get(key);
      if (league) {
        await this.simulateValueUpdate(leagueId, year, league.KRW);
      } else {
        this.fastify.log.warn(`[server]: ${key} 리그 데이터를 찾을 수 없음`);
      }
    }, 6000);

    this.simulationIntervals.set(key, interval);
    this.fastify.log.info(`[server]: ${key} 새로운 시뮬레이션 시작`);
  }

  stopValueSimulation(leagueId: string, year: string) {
    const key = this.getSimulationKey(leagueId, year);
    if (this.simulationIntervals.has(key)) {
      clearInterval(this.simulationIntervals.get(key));
      this.simulationIntervals.delete(key);
      this.simulatedLeagues.delete(key);
      this.fastify.log.info(`[server]: ${key} 시뮬레이션 중지`);
    }
  }

  startAllSimulations() {
    this.fastify.log.info("[server]: 모든 시뮬레이션 시작");
    console.log(this.simulatedLeagues);

    if (this.simulatedLeagues.size === 0) {
      this.fastify.log.warn("[server]: 시뮬레이션할 리그가 없습니다.");
      return;
    }

    for (const [key, league] of this.simulatedLeagues) {
      const { leagueId, year } = league;
      this.startValueSimulation(leagueId, year);
      this.fastify.log.info(`[server]: ${key} 시뮬레이션 시작됨`);
    }
  }

  stopAllSimulations() {
    this.fastify.log.info("[server]: 모든 시뮬레이션 중지");
    for (const [key] of this.simulationIntervals) {
      const [leagueId, year] = key.split("_");
      this.stopValueSimulation(leagueId, year);
    }
  }

  private async updateLeagueValue(data: UpdateLeagueValueData) {
    const updatedValue = await this.prisma.leagueValue
      .updateMany({
        where: {
          AND: [{ leagueId: data.leagueId }, { year: data.year }],
        },
        data: {
          KRW: data.KRW,
          changeRate: 0,
        },
      })
      .then(() =>
        this.prisma.leagueValue.findFirst({
          where: {
            AND: [{ leagueId: data.leagueId }, { year: data.year }],
          },
          include: {
            league: true,
          },
        })
      );

    if (!updatedValue) {
      throw new Error("League value not found after update");
    }

    if (this.leagueCache) {
      await this.leagueCache.setLeagueValue(
        data.leagueId,
        data.year,
        updatedValue
      );
    }

    const key = this.getSimulationKey(data.leagueId, data.year);
    this.simulatedLeagues.set(key, {
      leagueId: data.leagueId,
      year: data.year,
      KRW: data.KRW,
    });

    return updatedValue;
  }

  registerHandlers(socket: Socket): void {
    socket.on("connect", () => {
      this.fastify.log.info(`[server]: client 연결 성공: ${socket.id}`);
    });

    socket.on(
      "requestLeagueValue",
      async (data: { leagueId: string; year: string }) => {
        try {
          this.stopAllSimulations();

          const leagueValue = await this.getLeagueValue(
            data.leagueId,
            data.year
          );

          if (leagueValue) {
            await this.initializeSimulation(data.leagueId, data.year);
            const key = this.getSimulationKey(data.leagueId, data.year);
            if (this.simulatedLeagues.has(key)) {
              this.startValueSimulation(data.leagueId, data.year);
            }
          }

          socket.emit("leagueValueResponse", leagueValue);
        } catch (error) {
          this.fastify.log.error("[server]: league value 조회 실패:", error);
          socket.emit("error", "league value 조회 실패");
        }
      }
    );

    socket.on("disconnect", () => {
      this.stopAllSimulations();
    });

    socket.on("updateLeagueValue", async (data: UpdateLeagueValueData) => {
      try {
        const updatedValue = await this.updateLeagueValue(data);
        this.io.emit("leagueValueUpdated", {
          leagueId: data.leagueId,
          updatedValue,
        });
      } catch (error) {
        this.fastify.log.error("[server]: league value 업데이트 실패:", error);
        socket.emit("error", "league value 업데이트 실패");
      }
    });
  }
}
