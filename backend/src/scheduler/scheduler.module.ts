import { Module } from '@nestjs/common';
import { MatchScheduler } from './match.scheduler';
import { FootballModule } from 'src/football/football.module';
import { LogModule } from 'src/log/log.module';

@Module({
    imports: [LogModule, FootballModule],
    providers: [MatchScheduler],
})
export class SchedulerModule { }