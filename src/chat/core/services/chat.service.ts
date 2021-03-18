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
import { ChatMessageEntity } from '../../infrastructure/data-source/entities/ChatMessageEntity';
import { getRepository } from 'typeorm';

@Injectable()
export class ChatService implements IChatService {
  constructor(
    @InjectRepository(ChatClientEntity)
    private chatClientRepository: Repository<ChatClientEntity>,
    @InjectRepository(ChatMessageEntity)
    private chatMessageRepository: Repository<ChatMessageEntity>,
  ) {}
  async addMessage(message: string, senderId: string): Promise<ChatMessage> {
    let chatMessageEntity = this.chatMessageRepository.create();
    chatMessageEntity.message = message;
    chatMessageEntity.sender = await this.chatClientRepository.findOne({
      id: senderId,
    });
    chatMessageEntity.timeStamp = new Date(Date.now());
    chatMessageEntity = await this.chatMessageRepository.save(
      chatMessageEntity,
    );
    return {
      id: chatMessageEntity.id,
      message: chatMessageEntity.message,
      sender: chatMessageEntity.sender,
      timeStamp: chatMessageEntity.timeStamp,
    };
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

  async getMessages(): Promise<ChatMessage[]> {
    const messages = await this.chatMessageRepository.find({
      relations: ['sender'],
    });
    const chatMessages: ChatMessage[] = JSON.parse(JSON.stringify(messages));
    return chatMessages;
  }

  async delete(id: string): Promise<void> {
    await this.chatMessageRepository.delete({ sender: { id: id } });
    await this.chatClientRepository.delete({ id: id });
  }

  async updateTyping(typing: boolean, id: string): Promise<ChatClient> {

    const clientDb = await this.chatClientRepository.findOne({
      id: id,
    });

    if (clientDb && clientDb.typing !== typing) {
      clientDb.typing = typing;
      return {
        id: '' + clientDb.id,
        nickName: clientDb.nickName,
        typing: clientDb.typing,
      };
    } else {
      return null;
    }
  }
}
