import { Module } from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { AwsS3Controller } from './aws-s3.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileUpload } from '../../models/FileUpload';

@Module({
  imports: [TypeOrmModule.forFeature([FileUpload])],
  controllers: [AwsS3Controller],
  providers: [AwsS3Service],
})
export class AwsS3Module {}
