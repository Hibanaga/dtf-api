import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';

@Entity({ name: 'post' })
export class Post {
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

  @Column({ type: 'varchar', name: 'message' })
  message: string;

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  post: Post;
}
