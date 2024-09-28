import {
  Get,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiResponse,
  ApiOperation,
  ApiForbiddenResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserService } from '@src/modules/users/services/user.service';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { User } from '@src/modules/users/entities/user.entity';
import { RolesGuard } from '@src/modules/auth/guards/roles-guard';
import { AllowedRoles } from '@src/common/decorators/allowed-roles.decorator';
import { Roles } from '@src/common/enums/roles.enum';
import { AdminController } from '@src/common/decorators/admin-controller.decorator';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';

@ApiBearerAuth()
@AllowedRoles([Roles.ADMIN])
@UseGuards(RolesGuard)
@AdminController({ routePrefix: 'user', tagName: 'User' })
export class UserAdminController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'List of users', type: [User] })
  @ApiForbiddenResponse({ description: 'Access denied. Admins only.' })
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: User } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneBy({ id });
  }

  @ApiOperation({ summary: 'Update user details' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: User } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete user by ID' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: User } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
    HttpStatus.FORBIDDEN,
  ])
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.userService.remove(id);
  }

  @ApiOperation({ summary: 'Get admin statistics' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: User } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.FORBIDDEN,
  ])
  @Get('statistics')
  async getStatistics() {
    return this.userService.getStatistics();
  }
}
