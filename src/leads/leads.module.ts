import { Module } from '@nestjs/common';
import { LeadsService } from './leads.service';
import { LeadsController } from './leads.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TasksService } from 'src/schedule/cron';
import { FutbolUpdadeService } from 'src/redis/FutbolUpdate';
@Module({
  controllers: [LeadsController],
  providers: [LeadsService, PrismaService]
})
export class LeadsModule {}
