import { Module } from '@nestjs/common';
import { RedisIoAdapter } from './redis-io.adapter';
import { TrucoGateway } from './truco/truco.gateway'; // Importe o TrucoGateway

@Module({
  providers: [RedisIoAdapter, TrucoGateway], // Adicione o RedisIoAdapter e o TrucoGateway como provedores
})
export class WebSocketModule {}
