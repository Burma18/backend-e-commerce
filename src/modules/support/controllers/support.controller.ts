import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from '../services/support.service';
import { CreateSupportDto } from '../dto/create-support.dto';
import { UpdateSupportDto } from '../dto/update-support.dto';
import { Support } from '../entities/support.entity';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';

@ApiBearerAuth()
@WebController({ routePrefix: 'support', tagName: 'Support' })
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({ summary: 'Get all support requests' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Support } },
    HttpStatus.UNAUTHORIZED,
  ])
  @Get(':telegramId')
  async getAllSupportRequests(): Promise<Support[]> {
    return await this.supportService.findAll();
  }

  @ApiOperation({ summary: 'Get a support request by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Support } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Get(':id/:telegramId')
  async getSupportRequest(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<Support> {
    return await this.supportService.findOneBy({ id });
  }

  @ApiOperation({ summary: 'Create a new support request' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Support } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.BAD_REQUEST,
  ])
  @Post(':telegramId')
  async createSupportRequest(
    @Body() createSupportDto: CreateSupportDto,
  ): Promise<Support> {
    return await this.supportService.create(createSupportDto);
  }

  @ApiOperation({ summary: 'Update a support request by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Support } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Put(':id/:telegramId')
  async updateSupportRequest(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateSupportDto: UpdateSupportDto,
  ): Promise<Support | null> {
    return await this.supportService.update(id, updateSupportDto);
  }

  @ApiOperation({ summary: 'Delete a support request by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Support } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Delete(':id/:telegramId')
  async deleteSupportRequest(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.supportService.remove(id);
  }
}
