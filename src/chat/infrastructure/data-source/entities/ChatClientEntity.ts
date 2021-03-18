import {
  Column,
  Entity,
  OneToMany,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatMessageEntity } from './ChatMessageEntity';

@Entity()
export class ChatClientEntity {
  @PrimaryColumn({ unique: true })
  public id: string;

  @Column({ unique: true })
  public nickName: string;

  @Column({ type: 'boolean', nullable: true })
  public typing?: boolean | undefined;
}
