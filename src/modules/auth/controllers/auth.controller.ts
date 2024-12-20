import { Post, Body, Res, HttpStatus, Put } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { StartDto } from '../dto/start-app.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';
import { User } from '@src/modules/users/entities/user.entity';
import { CreateUserDto } from '@src/modules/users/dto/create-user.dto';
import { UserService } from '@src/modules/users/services/user.service';
import { WebController } from '@src/common/decorators/web-controller.decorator';
import { UpdateUserDto } from '@src/modules/users/dto/update-user.dto';

@ApiTags('Auth')
@WebController({ routePrefix: 'auth', tagName: 'Auth' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('start')
  @ApiOperation({ summary: 'Start the authentication process' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: {} },
    HttpStatus.BAD_REQUEST,
  ])
  async start(@Body() startDto: StartDto, @Res() res: Response) {
    const result = await this.authService.start(startDto);
    return res.json({ role: result.role });
  }

  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponseDecorator([{ code: HttpStatus.OK, options: { type: User } }])
  @Post()
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const newUser = await this.userService.create(createUserDto);
    const result = await this.authService.start({
      telegramId: parseInt(newUser.telegramId),
      username: newUser.username,
    });

    return res.json({ role: result.role });
  }

  @ApiOperation({ summary: 'Update user details' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: { type: User } },
    HttpStatus.NOT_FOUND,
  ])
  @Put()
  update(@Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(updateUserDto);
  }
}
