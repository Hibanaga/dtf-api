import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Comment } from './Comment';
import { PostActivity } from './PostActivity';
import { CommentActivity } from './CommentActivity';
import { PostFileUpload } from './PostFileUpload';

@Entity({ name: 'posts' })
export class Post {
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

  @Column({ type: 'varchar', name: 'title' })
  title: string;

  @Column({ type: 'uuid', nullable: true, name: 'user_id' })
  userId: string;

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];

  @ManyToOne(() => User, (user) => user.posts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => PostActivity, (postActivity) => postActivity.post, {
    cascade: true,
    eager: true,
  })
  postActivities: PostActivity[];

  @OneToMany(() => CommentActivity, (commentActivity) => commentActivity.post, {
    cascade: true,
    eager: true,
  })
  commentActivities: CommentActivity[];

  @OneToMany(() => PostFileUpload, (postFileUpload) => postFileUpload.post, {
    cascade: true,
    eager: true,
  })
  postFilesUpload: PostFileUpload[];
}
