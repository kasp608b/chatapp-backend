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
      timeStamp: new Date(Date.now()),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  newClient(id: string, nickname: string): ChatClient {
    let chatClient = this.clients.find(
      (c) => c.nickName === nickname && c.id === id,
    );
    if (chatClient) {
      return chatClient;
    }
    if (this.clients.find((c) => c.nickName === nickname)) {
      throw new Error('Nickname already used');
    }
    chatClient = { id: id, nickName: nickname };
    this.clients.push(chatClient);
    return chatClient;
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
