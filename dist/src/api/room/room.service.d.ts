import configuration from 'src/config/configuration';
import { DatabaseService } from '../../database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { ConfigType } from '@nestjs/config';
export declare class RoomService {
    private config;
    private db;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger);
    CreatemessageRoom(senderid: number, receiverid: number, message: string): import("rxjs").Observable<any[]>;
    GetUser(): import("rxjs").Observable<any[]>;
    GetSearchUser(text: any): void;
}
