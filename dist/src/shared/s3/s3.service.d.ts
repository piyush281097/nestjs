import configuration from 'src/config/configuration';
import { ConfigType } from '@nestjs/config';
interface S3ImageUpload {
    bucket: string;
    path: string;
    filename: string;
}
export declare class S3Service {
    private config;
    private S3;
    constructor(config: ConfigType<typeof configuration>);
    getS3PreSignUrl({ bucket, filename, path }: S3ImageUpload): import("rxjs").Observable<{
        uploadUrl: string;
        filePath: string;
    }>;
}
export {};
