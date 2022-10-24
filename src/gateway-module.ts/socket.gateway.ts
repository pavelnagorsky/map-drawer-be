import {
  // SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  } from '@nestjs/websockets';
  import { Logger } from '@nestjs/common';
  import { Socket, Server } from 'socket.io';
  
import { SocketService } from './socket.service';
  
@WebSocketGateway({
  cors: {
    origin: '*',
  }
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  constructor(private readonly socketService: SocketService) {}

  @WebSocketServer() 
  server: Server;

  private logger: Logger = new Logger('AppGateway');
  
  // @SubscribeMessage('msgToServer')
  // handleMessage(client: Socket, payload: string): void {
  //   console.log(payload)
  //   this.server.emit('msgToClient', payload);
  // }

  afterInit(server: Server) {
    this.socketService.socket = server
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}