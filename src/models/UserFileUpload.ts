import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { FileUpload } from './FileUpload';
import { User } from './User';

@Entity({ name: 'user_file_uploads_indexes' })
export class UserFileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
