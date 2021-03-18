import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ChatClientEntity } from './ChatClientEntity';

@Entity()
export class ChatMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  message: string;
  @Column()
  sender: ChatClientEntity;
  @Column()
  timeStamp: Date;
}
