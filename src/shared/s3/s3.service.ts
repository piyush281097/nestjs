import * as AWS from 'aws-sdk';
import { from, map } from 'rxjs';
import configuration from 'src/config/configuration';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

interface S3ImageUpload {
  bucket: string;
  path: string;
  filename: string;
}

@Injectable()
export class S3Service {
  private S3: AWS.S3;
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
  ) {
    AWS.config.update({
      credentials: {
        accessKeyId: this.config.aws.accessKeyID,
        secretAccessKey: this.config.aws.secretAccessKey,
      },
      region: this.config.aws.region,
    });
    this.S3 = new AWS.S3({ s3ForcePathStyle: true, signatureVersion: 'v4' });
  }

  getS3PreSignUrl({ bucket, filename, path }: S3ImageUpload) {
    const imageOrgUrl = `https://${bucket}.s3.${this.config.aws.region}.amazonaws.com/${path}/${filename}`;

    return from(
      this.S3.getSignedUrlPromise('putObject', {
        Bucket: bucket,
        ACL: 'public-read',
        Key: `${path}/${filename}`,
      }),
    ).pipe(
      map((uploadUrl: string) => ({
        uploadUrl: uploadUrl,
        filePath: imageOrgUrl,
      })),
    );
  }
}
