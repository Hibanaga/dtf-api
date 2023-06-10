import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PostFileUpload } from './PostFileUpload';
import { UserFileUpload } from './UserFileUpload';

@Entity({ name: 'file_uploads' })
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ type: 'varchar', name: 'file_name' })
  fileName: string;

  @Column({ type: 'varchar', name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'varchar', name: 'mime_type' })
  mimeType: string;

  @Column({ type: 'varchar', name: 'original_name' })
  originalName: string;

  @OneToMany(
    () => PostFileUpload,
    (postFileUpload) => postFileUpload.fileUpload,
    {
      cascade: true,
      eager: true,
    },
  )
  postFilesUpload: PostFileUpload[];

  @OneToMany(
    () => UserFileUpload,
    (userFileUpload) => userFileUpload.fileUpload,
    {
      cascade: true,
      eager: true,
    },
  )
  userFilesUpload: UserFileUpload[];
}
