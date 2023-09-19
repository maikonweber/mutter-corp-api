import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { CustomerModule } from 'src/customer/customer.module';
import { CustomerService } from 'src/customer/customer.service';
import { LocalStrategy } from './local.auth';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from "@nestjs/passport"
import { PrismaService } from 'src/prisma/PrismaService';
import { jwtConstants } from './jwtConstant';
import { AuthGuardService } from './authGuard';

@Module({
  imports: [CustomerModule, JwtModule.register({
    global: true,
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '5d'}
  })],
  providers: [AuthService, CustomerService, LocalStrategy, PrismaService],
  exports: [AuthService]
})

export class AuthModule {}
