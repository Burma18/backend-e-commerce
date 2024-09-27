import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { StartDto } from '../dto/start-app.dto';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiResponseDecorator } from '@src/common/decorators/api-response.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start the authentication process' })
  @ApiResponseDecorator([
    { code: HttpStatus.OK, options: {} },
    HttpStatus.BAD_REQUEST,
  ])
  async start(@Body() startDto: StartDto, @Res() res: Response) {
    const result = await this.authService.start(startDto);
    res.cookie('session', result.token, {
      httpOnly: true,
      secure: true,
    });
    return res.json({ role: result.role });
  }
}
