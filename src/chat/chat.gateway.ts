import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server;
  @SubscribeMessage('message')
  handleEvent(@MessageBody() data: string): string {
    console.log(data);
    this.server.emit('messages', data);
    return data + 'Hello';
  }

  handleConnection(client: any, ...args: any[]): any {
    console.log('Client Connect', client.id);
  }

  handleDisconnect(client: any): any {
    console.log('Client disconnect', client.id);
  }
}
