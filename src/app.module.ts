import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import AppService from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthModule } from './auth/auth.module';
import { jwtConstants } from './auth/jwtConstant';
import { CustomerModule } from './customer/customer.module';
import { LeadsModule } from './leads/leads.module';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/PrismaService';
import { RedisService } from './redis/redis';
import { TasksService } from './schedule/cron';
import { LoggerMiddleware } from './logger.middleware';
import { FutbolUpdadeService } from './redis/FutbolUpdate';
import { WebsocketModule } from './websocket/websocket.module';
import { TelegramService } from './telegram/telegram.service';
import { ConfigModule } from '@nestjs/config';
import { ShoppeService } from './shoppe/shoppe.service';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    PrismaModule,
    CustomerModule,
    AuthModule,
    LeadsModule,
    WebsocketModule,
    ConfigModule.forRoot({
      isGlobal: true, // Make the configuration module global
    }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5d' }
    }),

  ],
  controllers: [AppController, AuthController],
  providers: [
    RedisService,
    FutbolUpdadeService,
    AppService,
    RedisService,
    PrismaService,
    TasksService,
    TelegramService,
    ShoppeService,
    
  ],
})
export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(LoggerMiddleware).forRoutes('*')
  }
}


