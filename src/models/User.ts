import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';
import { PostActivity } from './PostActivity';
import { CommentActivity } from './CommentActivity';
import { FileUpload } from './FileUpload';

export enum Gender {
  Men = 'men',
  Women = 'women',
  Other = 'other',
}

@Entity({ name: 'users' })
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Index()
  @Column({ type: 'varchar', name: 'email' })
  email: string;

  @Index()
  @Column({ type: 'varchar', name: 'password' })
  password: string;

  @Index()
  @Column({ type: 'varchar', name: 'user_name' })
  userName?: string;

  @Index()
  @Column({ type: 'varchar', name: 'first_name', nullable: true })
  firstName?: string;

  @Index()
  @Column({ type: 'varchar', name: 'last_name', nullable: true })
  lastName?: string;

  @Column({ type: 'varchar', name: 'gender', nullable: true })
  gender?: Gender;

  @ManyToOne(() => FileUpload, (fileUpload) => fileUpload.user)
  @Column({ type: 'uuid', name: 'upload_file_id', nullable: true })
  fileUpload?: FileUpload;

  @OneToMany(() => Post, (post) => post.user, {
    cascade: true,
    eager: true,
  })
  posts: Post[];

  @OneToMany(() => Comment, (comment) => comment.user, {
    cascade: true,
    eager: true,
  })
  comments: Comment[];

  @OneToMany(() => PostActivity, (postActivity) => postActivity.user, {
    cascade: true,
    eager: true,
  })
  postActivities: PostActivity[];

  @OneToMany(() => CommentActivity, (commentActivity) => commentActivity.user, {
    cascade: true,
    eager: true,
  })
  commentActivities: CommentActivity[];
}
