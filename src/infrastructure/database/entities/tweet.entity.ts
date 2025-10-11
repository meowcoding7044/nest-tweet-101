import { Hashtag } from 'src/infrastructure/database/entities/hashtag.entity';
import { User } from 'src/infrastructure/database/entities/user.entity';
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

  @ManyToOne(() => User, (user) => user.tweets, { eager: true })
  user: User;

  @ManyToMany(() => Hashtag, (hashtag) => hashtag.tweets,{ eager: true })
  @JoinTable()
  hashtags: Hashtag[];
}
