import { Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { predictionQueue } from '../queue/queues/prediction.queue';
import { LogService } from 'src/log/log.service';
import { FootballService } from 'src/football/football.service';

const activeModels = [
    'Open Router',
    'Google Gemini 2.5 Flash'
];

@Injectable()
export class MatchScheduler {
    constructor(@Inject(LogService) private readonly log: LogService,
        @Inject(FootballService) private readonly football: FootballService) {
        console.log("MatchScheduler initialized");
    }

    @Cron(CronExpression.EVERY_HOUR) // Run every hour at minute 0
    async cronMatches() {
        await predictionQueue.obliterate();

        const matches = await this.football.getUpcomingMatches();

        for (const match of matches) {
            const kickoffTime = new Date(match.utcDate);
            const delay = kickoffTime.getTime() - Date.now() - 10 * 60 * 1000;
            for (const model of activeModels) {
                await predictionQueue.add(`match-${match.id} ${match.homeTeam.name} vs ${match.awayTeam.name}`, {
                    matchId: match.id,
                    model: model
                },
                    { delay }
                );
            }
        }

        await this.log.createLog('Refresh Queue', 'SUCCESS', 'Prediction queue refreshed!');
    }

    @Cron(CronExpression.EVERY_MINUTE)
    async cronLog() {
        console.log("Scheduler is running...");
    }
}