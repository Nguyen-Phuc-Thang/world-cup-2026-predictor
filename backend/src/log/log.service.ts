import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class LogService {
    constructor(private readonly prismaService: PrismaService) { }

    async createLog(jobType: string, status: string, message: string) {
        return this.prismaService.client.log.create({
            data: {
                jobType,
                status,
                message,
            },
        });
    }

    async getAllLogs() {
        return this.prismaService.client.log.findMany({
            orderBy: {
                createdAt: 'desc',
            },
        });
    }
}
