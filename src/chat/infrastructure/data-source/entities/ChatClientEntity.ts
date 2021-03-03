import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class ChatClientEntity {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nickName: string;
}
