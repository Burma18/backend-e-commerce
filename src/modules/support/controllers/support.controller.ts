import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SupportService } from '../services/support.service';
import { CreateSupportDto } from '../dto/create-support.dto';
import { UpdateSupportDto } from '../dto/update-support.dto';
import { Support } from '../entities/support.entity';
import { AdminGuard } from '@src/modules/auth/guards/admin-guard';

@ApiTags('Support')
@Controller('support')
@UseGuards(AdminGuard)
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({ summary: 'Get all support requests' })
  @ApiResponse({
    status: 200,
    description: 'List of support requests',
    type: [Support],
  })
  @Get()
  async getAllSupportRequests(): Promise<Support[]> {
    return await this.supportService.findAll();
  }

  @ApiOperation({ summary: 'Get a support request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Support request details',
    type: Support,
  })
  @ApiResponse({ status: 404, description: 'Support request not found' })
  @Get(':id')
  async getSupportRequest(@Param('id') id: number): Promise<Support | null> {
    return await this.supportService.findOneById(id);
  }

  @ApiOperation({ summary: 'Create a new support request' })
  @ApiResponse({
    status: 201,
    description: 'Support request created',
    type: Support,
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @Post()
  async createSupportRequest(
    @Body() createSupportDto: CreateSupportDto,
  ): Promise<Support> {
    return await this.supportService.create(createSupportDto);
  }

  @ApiOperation({ summary: 'Update a support request by ID' })
  @ApiResponse({
    status: 200,
    description: 'Support request updated',
    type: Support,
  })
  @ApiResponse({ status: 404, description: 'Support request not found' })
  @Put(':id')
  async updateSupportRequest(
    @Param('id') id: number,
    @Body() updateSupportDto: UpdateSupportDto,
  ): Promise<Support | null> {
    return await this.supportService.update(id, updateSupportDto);
  }

  @ApiOperation({ summary: 'Delete a support request by ID' })
  @ApiResponse({ status: 200, description: 'Support request deleted' })
  @ApiResponse({ status: 404, description: 'Support request not found' })
  @Delete(':id')
  @UseGuards(AdminGuard)
  async deleteSupportRequest(@Param('id') id: number): Promise<void> {
    await this.supportService.remove(id);
  }
}
