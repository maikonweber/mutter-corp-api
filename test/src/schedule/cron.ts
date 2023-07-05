import { Injectable, Logger } from '@nestjs/common';
import * as
schedule from '@nestjs/schedule';
import { FutbolUpdadeService } from 'src/redis/FutbolUpdate';
import axios from 'axios';
import { error } from 'console';
import { RedisService } from 'src/redis/redis';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private readonly nameOfRateLimit: string = "futbolRateLimit"
  constructor(
    private readonly FutbolUpdate: FutbolUpdadeService,
    private readonly redis: RedisService,
    private readonly prisma: PrismaService
  ) {
  }

  @Cron('1 0 * * *')
  async updateRateLimit() {
    // Calculate the remaining seconds until 00:59
    this.logger.verbose("Update Rate Limit Information");
    const currentDate = new Date();
    const currentHour = currentDate.getHours();
    const currentMinutes = currentDate.getMinutes();
    const currentSeconds = currentDate.getSeconds();

    let remainingSeconds = 0;

    if (currentHour === 0 && currentMinutes < 59) {
      remainingSeconds = (59 - currentMinutes - 1) * 60 + (60 - currentSeconds);
    }

    try {
      await this.redis.set(`${this.nameOfRateLimit}`, 100);
      await this.redis.expireKey(`${this.nameOfRateLimit}`, remainingSeconds);
      this.logger.log("Rate Limit Update SucessFully");
    } catch {
      this.logger.log("Erro Updating rate limit", error)
    }
  }

  @Cron('0 0 * * 3,0')
  async updateTeamStatistics() {

    this.logger.verbose("Update each team statisct run every thusday");

    const teams_in_season = await this.prisma.league_teams.findMany()

    this.logger.log(teams_in_season);

    for (const league in teams_in_season) {

      const teams_static =  await this.FutbolUpdate.getStatistAboutTeam(71, 2023, 71)

       return
    }

  }

  async




}
