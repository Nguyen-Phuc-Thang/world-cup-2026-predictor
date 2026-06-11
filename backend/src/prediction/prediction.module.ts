import { Module } from '@nestjs/common';
import { PredictionService } from './prediction.service';
import { PredictionController } from './prediction.controller';
import { PredictionWorker } from './prediction.worker';
import { LogModule } from 'src/log/log.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { FootballModule } from 'src/football/football.module';

@Module({
  imports: [FootballModule, PrismaModule, LogModule],
  controllers: [PredictionController],
  providers: [PredictionService, PredictionWorker],
})
export class PredictionModule { }
