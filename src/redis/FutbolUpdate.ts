import { Injectable, Logger } from "@nestjs/common";
import { RedisService } from "./redis";
import { PrismaService } from 'src/prisma/PrismaService';
import { FullDashboard } from "src/dto/fullDashboard.dto";
import axios from 'axios';
import { timestamp } from "rxjs";
import { time } from "console";
import { response } from "express";

@Injectable()
export class FutbolUpdadeService {
  private readonly logger = new Logger(FutbolUpdadeService.name);
  private readonly BASE_URL = 'https://v3.football.api-sports.io/';
  private readonly TOKEN = 'db90e4fb0c6f9d6db2c53bd53232d502';
  private readonly Country = 'Brazil'

  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService
  ) {
  }

  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getBestPlayerScore(league: number, season: number, current: any): Promise<any> {
    // const player = await this.prisma.football_players.findFirstOrThrow();
    const response = await axios.get(`${this.BASE_URL}/players`, {
      headers: {
        'x-apisports-key': this.TOKEN
      }, params: {
        league: league,
        season: season,
      }
    })


    return response.data.response
  }

  async updateNextWeak(league: number, season: number, current: boolean) {
    console.log(league, season)
    const response = await axios.get(`${this.BASE_URL}/fixtures`, {
      headers: {
        'x-apisports-key': this.TOKEN
      }, params: {
        league: league,
        season: season,
      }
    })

    const nextWeakRound = []
    const hoje = new Date();
    const seteDiasDepois = new Date(hoje.getTime() + (7 * 24 * 60 * 60 * 1000));
    const timestamp = Math.floor(seteDiasDepois.getTime() / 1000);
    
    for (const fixture of response.data.response) {
        if (fixture['fixture']['timestamp'] <= timestamp && fixture['fixture']['timestamp'] >= Math.floor(hoje.getTime() / 1000)) {
          console.log(fixture['fixture']['timestamp'] <= timestamp && fixture['fixture']['timestamp'] >= hoje.getTime );
          nextWeakRound.push(fixture);
        }
    }

    console.log(nextWeakRound);

    await this.redis.set(`${league}_${season}_next_weak_season`, JSON.stringify(nextWeakRound));
  }

  async oddFixturesUpdate(bookmaker: number, fixture_id: number) {
    const response = await axios.get(`${this.BASE_URL}/odds`, {
      headers: {
        'x-apisports-key': this.TOKEN
      }, params: {
        fixture: fixture_id,
        bookmaker: bookmaker
      }
    })
    const response_stract = response.data.response;

    return response_stract

  }



  async getCurrentRound(league: number, season: number, current: boolean) {
    console.log(league, season)
    const response = await axios.get(`${this.BASE_URL}/fixtures`, {
      headers: {
        'x-apisports-key': this.TOKEN
      }, params: {
        league: league,
        season: season,
      }
    })

    return response.data.response
  }

  async getStatistAboutTeam(team_id: number, season: number, league_id: number): Promise<void> {
    const response = await axios.get(`${this.BASE_URL}/statistic`, {
      headers: {
        'x-apisports-key': this.TOKEN
      }, params: {
        league: league_id,
        season: season,
        team: team_id
      }
    });
    await this.redis.subtractValueFromKey(`${'rate-limit'}`, 1)
    return response.data.response
  }



  async fixturesPredictionRound(fixture: number): Promise<any> {
    const response = await axios.get(`${this.BASE_URL}/predictions`, {
      headers: {
        'x-apisports-key': this.TOKEN
      }, params: {
        fixture: fixture
      }
    })

    console.log(response.data.response);

    return response.data.response
  }
}




