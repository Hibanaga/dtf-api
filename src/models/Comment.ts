import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Column({ type: 'integer', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'integer', default: 0, name: 'dislike_count' })
  dislikeCount: number;

  @ManyToOne(() => Post, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  user: User;
}
