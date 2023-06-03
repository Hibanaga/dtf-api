import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';

@Entity({ name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'integer', default: 0, name: 'like_count' })
  likeCount: number;

  @Column({ type: 'integer', default: 0, name: 'dislike_count' })
  dislikeCount: number;

  @Column({ type: 'varchar', name: 'message' })
  message: string;

  @Column({ type: 'uuid', nullable: true, name: 'post_id' })
  postId: string;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  userId: string;

  @ManyToOne(() => Post, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => User, (user) => user.comments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;
}
