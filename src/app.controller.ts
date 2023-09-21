import { Controller, Get, Logger, Param } from '@nestjs/common';
import AppService from './app.service';
import { Request } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { FutbolUpdadeService } from './redis/FutbolUpdate';
import { FullDashboard } from './dto/fullDashboard.dto';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name)

  constructor(
    private readonly appService: AppService,
  ) { }

  @Get('/get-current-round/:league/:seasson')
  @ApiParam({ name: 'league', description: 'league_id' }) 
  @ApiParam({ name: 'seasson', description: 'seasson'}) 
  async getNextWeakFeatures(@Param('league') league, @Param('seasson') seasson): Promise<any> {
    this.logger.log("Get Next Weak Features Controller");
    return this.appService.getCurrentRound(league, seasson, true);
  }

  @Get('/get-fixture-prediction/:fixture')
  @ApiParam({ name: 'fixture', description: 'league_id' })   
  async getFixtureDisplay(@Param('fixture') fixture): Promise<string> {
    this.logger.log("Get Fixtures Features Controller", fixture);
    return this.appService.getFixtureDisplay(fixture);
  }

  @Get('/get-fixture-prediction/:fixture/:bookmaker')
  @ApiParam({ name: 'fixture', description: 'league_id' })   
  async getOddsDisplay(@Param('fixture') fixture): Promise<string> {
    this.logger.log("Get Fixtures Odds Controller", fixture);
    return this.appService.getOddDisplay(fixture, 8);
  }
  
  @Get('/get-current-markting')
  async getCurrentMarktingPayload(@Request() req: any): Promise<any> {
    this.logger.log('Get Markting API to Products');
    return this.appService.getCurrentMarktingPayload();
  }

  @Get('/get-team-statist')
  async getTeamStatist(@Request() req: any): Promise<any> {
    this.logger.log('Get Markting API to Products');
    return this.appService.getCurrentMarktingPayload();
  }

  @Get('/update-counter-view')
  async updateCounterView(@Request() req: any): Promise<any> {
    this.logger.log('Update Website View Counter');
    return this.appService.getCurrentMarktingPayload();
  }
  
}

