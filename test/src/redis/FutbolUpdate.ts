import { Injectable } from "@nestjs/common";
import { RedisService } from "./redis";
import { PrismaService } from "src/prisma/prisma.service";
import { FullDashboard } from "src/dto/fullDashboard.dto";
import axios from 'axios';

@Injectable()
export class FutbolUpdadeService {
  private readonly BASE_URL = 'https://v3.football.api-sports.io/';
  private readonly TOKEN = 'db90e4fb0c6f9d6db2c53bd53232d502';
  private readonly Country = 'Brazil'
  constructor(
    private readonly redis: RedisService,
    private readonly prisma: PrismaService
  ) {

  }
  async getLeagueCountry(Country): Promise < string > {
    try {
      const response = await axios.get(`${this.BASE_URL}/leagues`, {
        headers: {
          'x-apisports-key': this.TOKEN
        }, params: {
          country: Country || this.Country
        }
      });
  
      response.data.response.forEach(async leagues => {
        const { id, name, type, logo } = leagues.league
        console.log(leagues)
        const flag = logo;
        const country = leagues.country.name;
        const code = leagues.country.code;
        const cup = type === "Cup" ? "Cup" : "Champion";
        await this.prisma.leagues.create({
          data: {
            id,
            name,
            cup,
            flag,
            country,
            code
          }
        })
      })
        await this.redis.subtractValueFromKey(`${'rate-limit'}`, 1)
        return response.data.data
  
    } catch(err) {
      console.log(err)
    }
  }

  async getCurrentRound(league: number, season: number, current: boolean) {
    const response = await axios.get(`${this.BASE_URL}/fixtures`, {
      headers: {
        'x-apisports-key': this.TOKEN
      }, params: {
        league: league,
        season: season,
      }
    })

    let key_prevent = `${league}-${season}-prevent`
    let key_next = `${league}-${season}-next`
    let now = new Date().valueOf();

    for(let rounds of response.data.response) {
      let timestamp = rounds['fixture']['timestamp']
      console.log(timestamp < now);
      if(timestamp < now) {
        await this.redis.sadd(key_next, JSON.stringify(rounds))
      } else {
        await this.redis.sadd(key_prevent, JSON.stringify(rounds));
      }
    };

  }

  async getStatistAboutTeam(team_id: number, season: number, league_id: number): Promise < void> {
  let key = `${team_id}_${season}_${league_id}`
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
  await this.redis.setKeyValue(key, JSON.stringify(response.data.response))
  await this.redis.expireKey(key, 7200);
  return response.data.response
}

  async GetCurrentRound(league: number, season: number, current: boolean): Promise < any > {
  const response = await axios.get(`${this.BASE_URL}/fixtures/rounds`, {
    headers: {
      'x-apisports-key': this.TOKEN
    }, params: {
      league: league,
      season: season,
      current: true
    }
  })

    response.data.response.forEach(async element => {
    await this.redis.sadd(`${league}}-${season}-current`, element)
  });
  await this.redis.subtractValueFromKey(`${'rate-limit'}`, 1)
}

  
async getTeamBySeasson(name): Promise < any > {
  
  const response = await axios.get(`${this.BASE_URL}/teams`, {
    headers: {
      'x-apisports-key': this.TOKEN
    }, params: {
      country: 'Brazil'
    }
  })


  response.data.response.forEach(async (element) => {
    let { team, venue } = element;
    let venues = venue;

    const { id, name, code = '', founded, national, logo } = team;

    try {

      await this.prisma.team.create({
        data: {
          id, name, code, founded, national, logo, venues
        }
      })
    } catch (er) {
      console.log(er)
    }
  })
    await this.redis.subtractValueFromKey(`${'rate-limit'}`, 1)
    return response.data.response;
}


  async getAllLeague() {
  try {
    const league = await this.prisma.leagues.findMany()
    return league;
  
  } catch (er) {
    console.log(er)
  }
}

  async getAllTeam() {
  try {
    const team = await this.prisma.team.findMany();
    return team;
  } catch (er) {
    console.log(er);
  }
}

}




