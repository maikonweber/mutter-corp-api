import { Controller, HttpCode, HttpStatus, Post, Body, Get, Logger, UseGuards, Headers,  Req} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCustomerDto } from '../customer/dto/create-customer.dto'
import { JwtService } from '@nestjs/jwt';
import { AuthGuardService } from './authGuard';
import { LocalStrategy } from './local.auth';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name)
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() LoginCustomerDto: LoginCustomerDto) {
    console.log(LoginCustomerDto)
    return this.authService.loginIn(LoginCustomerDto.email, LoginCustomerDto.password);
  }

  @UseGuards(AuthGuardService)
  @Get('get-user')
  async test(@Req() req): Promise<string> {
    return req.user
  }
}
