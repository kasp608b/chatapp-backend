import { Injectable } from '@nestjs/common';
import { ChatClient } from './chat-client.model';
import { ChatMessage } from './chat-message.model';

@Injectable()
export class ChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];
  newMessage(message: string, senderId: string): ChatMessage {
    const chatMessage: ChatMessage = {
      message,
      sender: this.clients.find((c) => c.id === senderId),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  newClient(id: string, nickname: string): void {
    const chatClient: ChatClient = { id: id, nickName: nickname };
    this.clients.push(chatClient);
  }

  getClients(): ChatClient[] {
    return this.clients;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  delete(id: string) {
    this.clients = this.clients.filter((c) => c.id !== id);
  }
}
