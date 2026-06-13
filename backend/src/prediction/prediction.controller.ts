import { Controller, Get, Param, Post, Query, Body } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) { }

  @Get(':matchId')
  async getPredictionByMatchId(@Param('matchId') matchId: string) {
    return this.predictionService.getPredictionsByMatchId(parseInt(matchId));
  }

  @Post('predict-match')
  async predictMatch(@Body() body: any) {
    const matchId = body.matchId;
    const modelChoosen = body.model;
    await this.predictionService.predictMatch(matchId, modelChoosen);
  }
}
