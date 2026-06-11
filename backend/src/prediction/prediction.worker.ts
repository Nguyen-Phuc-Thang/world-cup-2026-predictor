import { Injectable, OnModuleInit } from '@nestjs/common';
import { Worker } from 'bullmq';
import { redisConnection } from '../common/redis/redis.config';
import { PredictionService } from './prediction.service';

@Injectable()
export class PredictionWorker implements OnModuleInit {

  constructor(private readonly predictionService: PredictionService) { }

  onModuleInit() {
    const worker = new Worker('prediction',
      async (job) => {
        const { matchId, model } = job.data;
        await this.predictionService.predictMatch(matchId, model);
      },
      {
        connection: redisConnection as any,

        lockDuration: 30000,
      }
    );
  }
}