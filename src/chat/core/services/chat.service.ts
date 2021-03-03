import { Injectable } from '@nestjs/common';
import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';
import { IChatService } from '../primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import ChatClientEntity from '../../infrastructure/data-source/entities/ChatClientEntity';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { fromPromise } from 'rxjs/internal-compatibility';

@Injectable()
export class ChatService implements IChatService {
  allMessages: ChatMessage[] = [];
  clients: ChatClient[] = [];
  constructor(
    @InjectRepository(ChatClientEntity)
    private chatClientRepository: Repository<ChatClientEntity>,
  ) {}
  newMessage(message: string, senderId: string): ChatMessage {
    const chatMessage: ChatMessage = {
      message,
      sender: this.clients.find((c) => c.id === senderId),
      timeStamp: new Date(Date.now()),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  newClient(id: string, nickname: string): Observable<ChatClient> {
    const chatClient = this.clients.find(
      (c) => c.nickName === nickname && c.id === id,
    );
    if (chatClient) {
      return of(chatClient);
    }
    if (this.clients.find((c) => c.nickName === nickname)) {
      throw new Error('Nickname already used');
    }
    const client = this.chatClientRepository.create();
    client.nickName = nickname;
    return fromPromise(this.chatClientRepository.save(client)).pipe(
      map((dbClient) => {
        return { id: '' + dbClient.id, nickName: nickname };
      }),
    );
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

  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id == id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
