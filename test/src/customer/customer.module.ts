import { Module } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CustomerController } from './customer.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from "../auth/jwtConstant";
import { LocalStrategy } from 'src/auth/local.auth';
import { AuthService } from 'src/auth/auth.service';
@Module({
  imports: [PrismaModule,  JwtModule.register({
    secret: jwtConstants.secret,
    signOptions: { expiresIn: '5d'}
  })],
  controllers: [CustomerController],
  providers: [CustomerService, LocalStrategy, AuthService],
  exports: [CustomerService]
})
export class CustomerModule {}
