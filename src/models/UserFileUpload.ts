import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { FileUpload } from './FileUpload';
import { User } from './User';

@Entity({ name: 'user_file_uploads_indexes' })
export class UserFileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Column({ type: 'uuid', name: 'upload_file_id' })
  uploadFileId: string;

  @ManyToOne(() => User, (user) => user.userFilesUpload, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => FileUpload, (fileUpload) => fileUpload.postFilesUpload, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'upload_file_id' })
  fileUpload: FileUpload;
}
