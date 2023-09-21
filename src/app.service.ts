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

  async nextUpdateWeak(league:number, season: number, current: boolean) : Promise<any> {
    await this.futbol.updateNextWeak(league, season, current);
  }

  async getCurrentRound(league: number, season: number, current: boolean): Promise<any> {
    const cached = await this.redis.get(`${league}_${season}_next_weak_season`)
    const parsedCached = JSON.parse(cached);
    return parsedCached;
  }

  async getFixtureDisplay(fixture_id: number): Promise<any> {
    const caching = await this.redis.get(`${fixture_id}`);
    const parsedCached = JSON.parse(caching);
    return caching;
  }

  async getOddDisplay(fixture_id: number, bookmaker: number): Promise<any> {
    const caching = await this.redis.get(`${fixture_id}_${bookmaker}_odds`);
    const parsedCached = JSON.parse(caching);
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

