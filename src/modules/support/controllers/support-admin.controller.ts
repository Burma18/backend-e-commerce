import {
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SupportService } from '../services/support.service';
import { CreateSupportDto } from '../dto/create-support.dto';
import { UpdateSupportDto } from '../dto/update-support.dto';
import { Support } from '../entities/support.entity';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { Roles } from '@src/common/enums/roles.enum';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';

@ApiBearerAuth()
@AllowedRoles([Roles.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'support', tagName: 'Support' })
export class SupportAdminController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOperation({ summary: 'Get all support requests' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Support } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get()
  async getAllSupportRequests(): Promise<Support[]> {
    return await this.supportService.findAll();
  }

  @ApiOperation({ summary: 'Get a support request by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: Support } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Get(':id')
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
    HttpStatus.FORBIDDEN,
  ])
  @Post()
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
    HttpStatus.FORBIDDEN,
  ])
  @Put(':id')
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
    HttpStatus.FORBIDDEN,
  ])
  @Delete(':id')
  async deleteSupportRequest(@Param('id') id: number): Promise<void> {
    await this.supportService.remove(id);
  }
}
