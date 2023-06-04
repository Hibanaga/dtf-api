import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { User } from './User';
import { Post } from './Post';
import { Comment } from './Comment';

export enum ReactionType {
  Like = 'like',
  Dislike = 'dislike',
}

@Entity({ name: 'comment_activities_indexes' })
export class CommentActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar', name: 'reaction_type' })
  reactionType?: ReactionType;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'post_id' })
  postId: string;

  @Column({ type: 'uuid', name: 'comment_id' })
  commentId: string;

  @ManyToOne(() => User, (user) => user.commentActivities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Post, (post) => post.commentActivities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => Comment, (comment) => comment.commentActivities, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comment;
}
