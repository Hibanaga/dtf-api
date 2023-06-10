import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FileUpload } from '../../models/FileUpload';

@Injectable()
export class AwsS3Service {
  private readonly region: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private s3: S3Client;

  constructor(
    @InjectRepository(FileUpload)
    private fileUploadRepository: Repository<FileUpload>,
    private configService: ConfigService,
  ) {
    this.region = configService.get<string>('S3_REGION') || 'eu-west-3';
    this.accessKeyId = configService.get<string>('ACCESS_KEY_ID');
    this.secretAccessKey = configService.get<string>('SECRET_ACCESS_KEY');

    this.s3 = new S3Client({
      region: this.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
  }

  async uploadFile(file: Express.Multer.File, key: string) {
    const bucket = this.configService.get<string>('S3_BUCKET');
    const input: PutObjectCommandInput = {
      Body: file.buffer,
      Bucket: bucket,
      Key: key,
      ContentType: file.mimetype,
      ACL: 'public-read',
    };

    try {
      const response: PutObjectCommandOutput = await this.s3.send(
        new PutObjectCommand(input),
      );
      if (response.$metadata.httpStatusCode === 200) {
        const response = {
          fileName: key,
          mimeType: file.mimetype,
          originalName: file.originalname,
          imageUrl: `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`,
        };

        return await this.fileUploadRepository.save(response);
      }
    } catch (err) {
      throw err;
    }
  }

  async removeImage(id: string) {
    const bucket = this.configService.get<string>('S3_BUCKET');

    try {
      const uploadedFile = await this.single(id);

      if (!uploadedFile) {
        throw new HttpException('Not found', HttpStatus.UNPROCESSABLE_ENTITY);
      }

      const input = {
        Bucket: bucket,
        Key: uploadedFile.fileName,
      };

      const response = await this.s3.send(new DeleteObjectCommand(input));

      if (response.$metadata.httpStatusCode === 204) {
        return await this.fileUploadRepository.remove(uploadedFile);
      }
    } catch (e) {
      throw e;
    }
  }

  async single(id: string) {
    return await this.fileUploadRepository.findOne({
      where: { id },
    });
  }
}
