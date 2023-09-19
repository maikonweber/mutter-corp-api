import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/PrismaService';
import { CreateLeadDTO } from './dto/lead.customer.dto';
@Injectable()
export class LeadsService {
  private readonly logger = new Logger(LeadsService.name)
  constructor(
  private prisma : PrismaService
  ) {}

  async createLead(CreateLeadDTO: CreateLeadDTO) {
    return this.prisma.lead.create({
      data: CreateLeadDTO
    })
  }

  async getAllLead() {
    return this.prisma.lead.findMany({
      select: {
          firstname: true,
          lastname: true,
          email: true,
          description: true,
      }
    })
  }
}
