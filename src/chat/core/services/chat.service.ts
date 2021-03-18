import { Injectable } from '@nestjs/common';
import { ChatClient } from '../models/chat-client.model';
import { ChatMessage } from '../models/chat-message.model';
import { IChatService } from '../primary-ports/chat.service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ChatClientEntity } from '../../infrastructure/data-source/entities/ChatClientEntity';
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
  addMessage(message: string, senderId: string): ChatMessage {
    const chatMessage: ChatMessage = {
      message,
      sender: this.clients.find((c) => c.id === senderId),
      timeStamp: new Date(Date.now()),
    };
    this.allMessages.push(chatMessage);
    return chatMessage;
  }

  async addClient(id: string, nickname: string): Promise<ChatClient> {
    const clientDb = await this.chatClientRepository.findOne({
      nickName: nickname,
    });
    if (!clientDb) {
      let client = this.chatClientRepository.create();
      client.id = id;
      client.nickName = nickname;
      client = await this.chatClientRepository.save(client);
      return { id: '' + client.id, nickName: client.nickName };
    }
    if (clientDb.id === id) {
      return { id: clientDb.id, nickName: clientDb.nickName };
    } else {
      throw new Error('Nickname already used');
    }
  }

  async getClients(): Promise<ChatClient[]> {
    const clients = await this.chatClientRepository.find();
    const chatClients: ChatClient[] = JSON.parse(JSON.stringify(clients));
    return chatClients;
  }

  getMessages(): ChatMessage[] {
    return this.allMessages;
  }

  async delete(id: string): Promise<void> {
    await this.chatClientRepository.delete({ id: id });
  }

  updateTyping(typing: boolean, id: string): ChatClient {
    const chatClient = this.clients.find((c) => c.id == id);
    if (chatClient && chatClient.typing !== typing) {
      chatClient.typing = typing;
      return chatClient;
    }
  }
}
