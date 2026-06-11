import { Controller, Get, Param } from '@nestjs/common';
import { FootballService } from './football.service';

@Controller('football')
export class FootballController {
  constructor(private readonly footballService: FootballService) { }


  @Get('all-matches')
  async getAllMatches() {
    return this.footballService.getAllMatches();
  }

  @Get('upcoming-matches')
  async getUpcomingMatches() {
    return this.footballService.getUpcomingMatches();
  }

  @Get('match/:id')
  async getMatchById(@Param('id') id: string) {
    return this.footballService.getMatchById(parseInt(id));
  }
}
