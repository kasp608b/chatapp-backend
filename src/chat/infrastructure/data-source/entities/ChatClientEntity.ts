import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ChatClientEntity {
  @PrimaryColumn({ unique: true })
  public id: string;

  @Column({ unique: true })
  public nickName: string;
}
