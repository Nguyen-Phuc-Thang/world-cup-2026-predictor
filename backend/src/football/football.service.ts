import { Injectable } from '@nestjs/common';
import { response } from 'express';

@Injectable()
export class FootballService {
    constructor() { }

    async getAllMatches() {
        const response = await fetch('http://api.football-data.org/v4/competitions/WC/matches', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_API_KEY || '',
            },
        });
        const data = await response.json();
        return data.matches;
    }

    async getUpcomingMatches() {
        const response = await fetch('http://api.football-data.org/v4/competitions/WC/matches?status=SCHEDULED', {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_API_KEY || '',
            },
        });
        const data = await response.json();
        return data.matches;
    }

    async getMatchById(matchId: number) {
        const response = await fetch(`http://api.football-data.org/v4/matches/${matchId}`, {
            headers: {
                'X-Auth-Token': process.env.FOOTBALL_API_KEY || '',
            },
        });
        const data = await response.json();
        return data;
    }

}
