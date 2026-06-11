import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PredictionModule } from './prediction/prediction.module';
import { FootballModule } from './football/football.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './scheduler/scheduler.module';
import { LogModule } from './log/log.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,   // Khởi tạo nền tảng DB trước
    LogModule,      // LogService dùng chung
    FootballModule, // FootballService dùng chung
    ScheduleModule.forRoot(),
    SchedulerModule, // SchedulerModule dùng LogService/FootballService
    PredictionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
