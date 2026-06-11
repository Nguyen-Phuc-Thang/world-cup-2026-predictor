import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { predictionQueue } from './queue/queues/prediction.queue';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.enableCors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  });


  const serverAdapter = new ExpressAdapter();
  serverAdapter.setBasePath('/admin/queues');

  createBullBoard({
    queues: [new BullMQAdapter(predictionQueue)],
    serverAdapter,
  });

  app.use('/admin/queues', serverAdapter.getRouter());

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
