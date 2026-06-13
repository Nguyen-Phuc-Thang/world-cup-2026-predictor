import { Injectable } from '@nestjs/common';
import { rankings } from 'lib/rankings';
import { FootballService } from 'src/football/football.service';
import { PrismaService } from 'src/prisma/prisma.service';
import OpenAI from 'openai';
import { LogService } from 'src/log/log.service';
import { GoogleGenAI } from '@google/genai';

const openRouter = new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey: process.env.OPENROUTER_API_KEY, // Key sk-or-... trong file .env
    defaultHeaders: {
        'HTTP-Referer': process.env.PORT ?? 'http://localhost:3001', // Yêu cầu của OpenRouter để định danh app
        'X-Title': 'World Cup Predictor',
    }
});

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

@Injectable()
export class PredictionService {
    constructor(private prisma: PrismaService, private football: FootballService, private log: LogService) { }

    async predictMatch(matchId: number, modelChoosen: string) {
        if (await this.predicted(matchId, modelChoosen)) {
            return;
        }
        const matchData = await this.football.getMatchById(matchId);
        const homeTeamName = matchData.homeTeam.name;
        const awayTeamName = matchData.awayTeam.name;
        const homeTeamTLA = matchData.homeTeam.tla;
        const awayTeamTLA = matchData.awayTeam.tla;

        const homeTeamRanking = rankings[homeTeamTLA] || 999;
        const awayTeamRanking = rankings[awayTeamTLA] || 999;


        const prompt = `You are a professional football analyst. You are given the following information about an upcoming match:\n
        - Competition: FIFA World Cup 2026\n
        - Stage: ${matchData.stage.replace('_', ' ')}\n
        - Home Team: ${homeTeamName} (TLA: ${homeTeamTLA}, FIFA Ranking: ${homeTeamRanking})\n
        - Away Team: ${awayTeamName} (TLA: ${awayTeamTLA}, FIFA Ranking: ${awayTeamRanking})\n
        Based on this information, provide a prediction for the final score of the match\n
        You are restricted to provide the prediction result as a JSON object in the following format:\n
        { \n
        "predictedHomeGoals": <number of goals for the home team, type: number>,\n
        "predictedAwayGoals": <number of goals for the away team, type: number>,\n
        "explanation": "<write 1-2 short sentences explaining the reasoning behind the prediction>"\n
        }`;

        let predictionResult: any;

        if (modelChoosen === 'Open Router') {
            const response = await openRouter.chat.completions.create({
                model: 'openrouter/free',
                messages: [
                    { role: 'user', content: prompt }
                ],

                response_format: { type: 'json_object' }
            });

            const rawContent = response.choices[0].message?.content;
            if (!rawContent) throw new Error('API not response');
            predictionResult = JSON.parse(rawContent.trim());
        } else if (modelChoosen === 'Google Gemini 2.5 Flash') {
            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: prompt,
                config: {
                    responseMimeType: 'application/json',
                    temperature: 0.3,
                },
            });

            if (!response.text) {
                throw new Error('API not response');
            }


            predictionResult = JSON.parse(response.text.trim());
        }


        await this.savePrediction(
            modelChoosen,
            matchId,
            'SUCCESS',
            homeTeamName,
            awayTeamName,
            predictionResult.predictedHomeGoals,
            predictionResult.predictedAwayGoals,
            predictionResult.explanation
        );

        await this.log.createLog('Predict Match', 'SUCCESS', `${modelChoosen} predicted match result ${homeTeamName} ${predictionResult.predictedHomeGoals} - ${predictionResult.predictedAwayGoals} ${awayTeamName}`);
    }


    async savePrediction(predictor: string, matchId: number, predictionStatus: string, homeTeam: string, awayTeam: string, predictedHomeGoals: number, predictedAwayGoals: number, explanation: string) {
        await this.prisma.client.prediction.create({
            data: {
                predictor,
                matchId,
                predictionStatus,
                homeTeam,
                awayTeam,
                predictedHomeGoals,
                predictedAwayGoals,
                explanation
            }
        });
    }

    async getPredictionsByMatchId(matchId: number) {
        return this.prisma.client.prediction.findMany({
            where: {
                matchId
            }
        });
    }

    async predicted(matchId: number, predictor: string) {
        const existingPrediction = await this.prisma.client.prediction.findFirst({
            where: {
                matchId,
                predictor
            }
        });
        return !!existingPrediction;
    }
}
