import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

interface MessageData {
  userId: string;
  message: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    credentials: true,
  },
})
export class WebsocketsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  afterInit(server: Server) {
    console.log('WebSocket Gateway initialized');

    server.on('custom-event', (data) => {
      console.log('Custom Event received:', data);
    });

    // Emit message to all clients
    server.emit('initial-event', { message: 'WebSocket Gateway inicializado' });
  }

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('messageToServer')
  handleMessage(
    @MessageBody() data: MessageData,
    @ConnectedSocket() client: Socket,
  ): void {
    console.log(data);
    console.log(
      `Message from client ${client.id} (${data.userId}): ${data.message}`,
    );
    this.server.emit('receive_message', data); // Broadcast to all clients
  }
}
