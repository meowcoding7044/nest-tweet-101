import { Hashtag } from 'src/infrastructure/database/entities/hashtag.entity';
import { UserEntity } from 'src/infrastructure/database/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  DeleteDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from 'typeorm';

@Entity()
export class Tweet {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'text',
    nullable: false,
  })
  text: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  image?: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.tweets, { eager: true })
  user: UserEntity;

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.tweets,{ eager: true })
  @JoinTable()
  hashtags: Hashtag[];
}
