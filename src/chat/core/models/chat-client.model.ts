import { ChatMessageEntity } from '../../infrastructure/data-source/entities/ChatMessageEntity';
import { ChatMessage } from './chat-message.model';

export interface ChatClient {
  id: string;
  nickName: string;
  typing?: boolean | undefined;
}
