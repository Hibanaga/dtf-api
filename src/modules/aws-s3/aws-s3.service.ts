import { Injectable } from '@nestjs/common';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  PutObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AwsS3Service {
  private readonly region: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;
  private s3: S3Client;

  constructor(private configService: ConfigService) {
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

      console.log('response: ', response);

      if (response.$metadata.httpStatusCode === 200) {
        return `https://${bucket}.s3.${this.region}.amazonaws.com/${key}`;
      }
    } catch (err) {
      throw err;
    }
  }
}
