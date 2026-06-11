import { Controller, Get, Param } from '@nestjs/common';
import { PredictionService } from './prediction.service';

@Controller('prediction')
export class PredictionController {
  constructor(private readonly predictionService: PredictionService) { }

  @Get(':matchId')
  async getPredictionByMatchId(@Param('matchId') matchId: string) {
    return this.predictionService.getPredictionsByMatchId(parseInt(matchId));
  }
}
