import { ChatMessage } from '../models/chat-message.model';
import { ChatClient } from '../models/chat-client.model';

export const IChatServiceProvider = 'IChatServiceProvider';
export interface IChatService {
  newMessage(message: string, senderId: string): ChatMessage;

  newClient(id: string, nickname: string): ChatClient;

  getClients(): ChatClient[];

  getMessages(): ChatMessage[];

  delete(id: string);

  updateTyping(typing: boolean, id: string): ChatClient;
}
