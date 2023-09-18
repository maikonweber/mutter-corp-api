import { Controller, Get, Logger } from '@nestjs/common';
import AppService from './app.service';
import { Request } from '@nestjs/common';
import { FutbolUpdadeService } from './redis/FutbolUpdate';
import { FullDashboard } from './dto/fullDashboard.dto';
import { TeamStatictDTO } from './dto/fullDashboard.dto' 

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)
  constructor(
    private readonly appService: AppService,
  ) { }

  @Get('/get-current-round')
  async getCurrentRound(@Request() req: FullDashboard): Promise<any> {
    this.logger.log('Get Current Round');
    let league = 71;
    let season = 2023;

    return await this.appService.getCurrentRound(league, season, true);
  }

  @Get('/get-player-score')
  getLeagueTeams(@Request() req: TeamStatictDTO): Promise<string> {
    return this.appService.getBestPlayerScore(req.league, req.season, true);
  }

  // Falta Criar o DTO AQUI
  @Get('/get-team-leagues-statict')
  getAllLeaguesAvailable(@Request() req: TeamStatictDTO): Promise<any> {
    return this.appService.getTeamStatist();
  }


  @Get('/get-current-markting')
  getCurrentMarktingPayload(@Request() req: any): Promise<any> {
    return this.appService.getCurrentMarktingPayload();
  }

}
