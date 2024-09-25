import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '../services/auth.service';
import { StartDto } from '../dto/start-app.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('start')
  @ApiOperation({ summary: 'Start the authentication process' })
  @ApiResponse({ status: 200, description: 'Token and role returned' })
  @ApiResponse({ status: 401, description: 'Invalid or expired token' })
  async start(@Body() startDto: StartDto, @Res() res: Response) {
    const result = await this.authService.start(startDto);
    res.cookie('session', result.token, {
      httpOnly: true,
      secure: true,
    });
    return res.json({ role: result.role });
  }
}
