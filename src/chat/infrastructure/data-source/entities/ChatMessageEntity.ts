import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ChatClientEntity } from './ChatClientEntity';

@Entity()
export class ChatMessageEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  message: string;
  @ManyToOne(() => ChatClientEntity)
  sender: ChatClientEntity;
  @Column()
  timeStamp: Date;
}
