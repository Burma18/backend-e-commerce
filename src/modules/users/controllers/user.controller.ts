import { Body, Get, HttpStatus, Put } from '@nestjs/common';
import { ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UserService } from '@src/modules/users/services/user.service';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';
import { User } from '@src/modules/users/entities/user.entity';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { GetJwtPayload } from '@src/common/decorators/get-jwt-payload.decorator';
import { IJwtPayload } from '@src/common/interaces/jwt-payload.interface';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';

@ApiBearerAuth()
@WebController({ routePrefix: 'user', tagName: 'User' })
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Get me' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: User } },
    HttpStatus.UNAUTHORIZED,
    HttpStatus.NOT_FOUND,
  ])
  @Get('me/:telegramId')
  async getMe(@GetJwtPayload() user: IJwtPayload): Promise<User> {
    return this.userService.getMe(user.id);
  }

  @ApiOperation({ summary: 'Update me' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: User } },
    HttpStatus.NOT_FOUND,
    HttpStatus.UNAUTHORIZED,
  ])
  @Put('me/:telegramId')
  update(
    @GetJwtPayload() user: IJwtPayload,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.updateMe(user.id, updateUserDto);
  }
}
