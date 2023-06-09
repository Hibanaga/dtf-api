import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './Post';
import { FileUpload } from './FileUpload';

@Entity({ name: 'post_file_uploads_indexes' })
export class PostFileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Post, (post) => post.postFilesUpload, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => FileUpload, (fileUpload) => fileUpload.postFilesUpload)
  @JoinColumn({ name: 'upload_file_id' })
  fileUpload: FileUpload;
}
