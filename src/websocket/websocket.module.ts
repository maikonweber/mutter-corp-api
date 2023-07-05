import { Module } from "@nestjs/common";
import { RedisIoAdapter } from "./redis-io.adapter";
import { WebsocketGateway } from "./websocket.gateway";

@Module({
    providers: [WebsocketGateway]
    
})

export class WebsocketModule {}