import {
  Controller,
  Param,
  ParseUUIDPipe,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AwsS3Service } from './aws-s3.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { v4 as uuidv4 } from 'uuid';

@Controller('aws-s3')
export class AwsS3Controller {
  constructor(private readonly awsS3Service: AwsS3Service) {}

  @UseInterceptors(FileInterceptor('image'))
  @Patch('/presign-image')
  async uploadImage(@UploadedFile() file: Express.Multer.File) {
    return await this.awsS3Service.uploadFile(file, uuidv4());
  }
}
