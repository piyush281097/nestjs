import { SES } from 'aws-sdk';
import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { ConfigType } from '@nestjs/config';
import { Logger } from '../logger/logging.service';
interface EmailFormat {
    to: string;
    from: string;
    subject: string;
    text: string;
    html: string;
}
export interface ISendEmail {
    email: EmailFormat;
    userId: number;
    emailType: string;
}
export declare class SesService {
    private config;
    private db;
    private logger;
    ses: SES;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger);
    sendEmail({ email, userId, emailType }: ISendEmail): Observable<any[]>;
}
export {};
