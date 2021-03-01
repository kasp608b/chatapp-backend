import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class client {
  @PrimaryGeneratedColumn()
  public id: number;

  @Column()
  public nickName: string;
}

export default client;
