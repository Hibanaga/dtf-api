import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from './User';
import { PostFileUpload } from './PostFileUpload';
import { UserFileUpload } from './UserFileUpload';

@Entity({ name: 'file_uploads' })
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar', name: 'file_name' })
  fileName: string;

  @Column({ type: 'varchar', name: 'image_url' })
  imageUrl: string;

  @Column({ type: 'varchar', name: 'bucket_type' })
  bucketType: string;

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
