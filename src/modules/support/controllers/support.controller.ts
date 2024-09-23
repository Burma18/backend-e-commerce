import { Controller, Get } from '@nestjs/common';
import { SupportService } from '../services/support.service';
import { Support } from '../entities/support.entity';

@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @Get()
  async getAllSupportRequests(): Promise<Support[]> {
    return await this.supportService.findAll();
  }
}
