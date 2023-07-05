import { IoAdapter } from '@nestjs/platform-socket.io';

export class RedisIoAdapter extends IoAdapter {
  createIOServer(port: number, options?: any): any {
    
    const server = super.createIOServer(3001, options);
    console.log(server)
    const redisAdapt = server.redisAdapter({
      host: 'localhost', // Configure according to your Redis information
      port: 6379,
    });

    server.adapter(redisAdapt);

    return server;
  }
}