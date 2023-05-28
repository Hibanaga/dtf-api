import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { Comment } from './Comment';

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

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;

  @Index()
  @Column({ type: 'varchar', name: 'user_name' })
  userName: string;

  @Index()
  @Column({ type: 'varchar', name: 'first_name' })
  firstName: string;

  @Index()
  @Column({ type: 'varchar', name: 'last_name' })
  lastName: string;

  @Column({ type: 'varchar', name: 'image_key' })
  imageKey: string;

  @Column({ type: 'varchar', name: 'gender' })
  gender: Gender;

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
}
