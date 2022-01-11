import { Observable } from 'rxjs';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { ConfigType } from '@nestjs/config';
import { Logger } from '../logger/logging.service';
import { ISendEmail } from '../ses/ses.service';
export declare class SendgridService {
    private config;
    private db;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger);
    sendEmail({ email, userId, emailType }: ISendEmail): Observable<any[]>;
}
