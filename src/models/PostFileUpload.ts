import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Post } from './Post';
import { FileUpload } from './FileUpload';

@Entity({ name: 'post_file_uploads_indexes' })
export class PostFileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'uuid', name: 'post_id' })
  postId: string;

  @Column({ type: 'uuid', name: 'upload_file_id' })
  uploadFileId: string;

  @ManyToOne(() => Post, (post) => post.postFilesUpload, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Post;

  @ManyToOne(() => FileUpload, (fileUpload) => fileUpload.postFilesUpload)
  @JoinColumn({ name: 'upload_file_id' })
  fileUpload: FileUpload;
}
