import { Body, Controller, Logger, Post, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLeadDTO } from './dto/lead.customer.dto'
import { LeadsService } from './leads.service';
@Controller('leads')
export class LeadsController {
  private readonly logger = new Logger(LeadsController.name)
  constructor(private readonly LeadService: LeadsService) { }
  @Post('/create-lead')
  async createLeads(@Body() CreateLeadDTO : CreateLeadDTO): Promise<any> {
      return this.LeadService.createLead(CreateLeadDTO)
  }

  @Get('/get-all-lead')
  async getAllLead() {
    return this.LeadService.getAllLead()
  }
}
