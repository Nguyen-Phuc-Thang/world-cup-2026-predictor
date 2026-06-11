import { Queue } from 'bullmq';
import { redisConnection } from '../../common/redis/redis.config';

export const predictionQueue = new Queue(
    'prediction',
    {
        connection: redisConnection as any,
    }
);