import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from './prisma/PrismaService';
import { RedisService } from "./redis/redis";
import { FutbolUpdadeService } from './redis/FutbolUpdate';

@Injectable()
export default class AppService {
  getLeagueTeams(): Promise<string> {
    throw new Error('Method not implemented.');
  }

  private readonly logger = new Logger(AppService.name)
  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
    private readonly futbol: FutbolUpdadeService
  ) {

  }

  async getCurrentRound(league: number, season: number, current: boolean): Promise<any> {
    const caching_prevent = await this.redis.smembers(`${league}-${season}-prevent`)
    const caching_next = await this.redis.smembers(`${league}-${season}-next`)

    if (caching_prevent.length < 1) {
      const current = await this.futbol.getCurrentRound(league, season, true);
      return current;
    }

    return [caching_prevent, caching_next];
  }

  async getBestPlayerScore(league: number, season: number, current: boolean): Promise<any> {
    const caching = await this.redis.get(`cache-best-score`);
    if (!caching) {
      return this.futbol.getBestPlayerScore(league, season, current);
    }

    return caching;
  }

  async getTeamStatist(team: number, season: number, league: number): Promise<any> {
    const caching = await this.redis.get(`${team}-${season}-${league}-statistic`);
    if (!caching) {
      const lastTeamStatict = await this.prisma.statistics_team.findFirst({
        where: {
          league_team_id: team
        },
        orderBy: {
           
        }
      });
      if (!lastTeamStatict) {
        return this.futbol.getStatistAboutTeam(team, season, league)
      }
    }
  }

  async getCurrentMarktingPayload(): Promise<any> {
    const type = ''
    const local = ''
    const caching = await this.redis.get(`${type}-${local}`);
    return caching;
  }

}

