import { Injectable, Logger } from '@nestjs/common';
import { FutbolUpdadeService } from 'src/redis/FutbolUpdate';
import { error } from 'console';
import { RedisService } from 'src/redis/redis';
import { Cron } from '@nestjs/schedule';
import { PrismaService } from 'src/prisma/PrismaService';

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


  @Cron('48 12 * * *')
  async updateNextRound() {
    this.logger.verbose("Atualizaçando o campeonato brasileiro para proxima semana")
    await this.FutbolUpdate.updateNextWeak(71, 2023, true);
  }

  @Cron('0 13 * * *')
  async updatePredictionRound() {
    const objetcRedisWeakFixture = await this.redis.get('71_2023_next_weak_season');
    const parsedAll = JSON.parse(objetcRedisWeakFixture);

    for (const fixture of parsedAll) {
      const id = fixture['fixture']['id'];
      this.logger.verbose("Atualizaçando o campeonato fixture para proxima semana", id)
      const prediction = await this.FutbolUpdate.fixturesPredictionRound(id)
      await this.FutbolUpdate.delay(60000);
      await this.redis.set(id, JSON.stringify(prediction));
    }
  }
  @Cron('01 13 * * *')
  async updateOddBookmaker() {
    const bookmaker = 8; // BET365
    const objetcRedisWeakFixture = await this.redis.get('71_2023_next_weak_season');
    const parsedAll = JSON.parse(objetcRedisWeakFixture);
    
    for (const fixture of parsedAll) {
      const id = fixture['fixture']['id'];
      this.logger.verbose("Atualizaçando Odds fixtures", id)
      const prediction = await this.FutbolUpdate.oddFixturesUpdate(bookmaker, id)
      await this.FutbolUpdate.delay(60000);
      await this.redis.set(`${id}_${bookmaker}_odds`, JSON.stringify(prediction));
    }

  }
} 
