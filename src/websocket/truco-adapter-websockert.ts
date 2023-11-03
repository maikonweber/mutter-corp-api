// websocket/truco/truco.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class TrucoGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleConnection(client: Socket) {
    // Implemente a lógica de conexão aqui
  }

  handleDisconnect(client: Socket) {
    // Implemente a lógica de desconexão aqui
  }
}
