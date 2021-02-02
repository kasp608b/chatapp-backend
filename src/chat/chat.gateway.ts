import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
@WebSocketGateway()
export class ChatGateway {
  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    return data + 'Hello';
  }
}
