import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { ConfigType } from '@nestjs/config';
import { NotificationMarkAsReadRequestDto } from './dto/mark-notification-as-read.dto';
export declare class NotificationsService {
    private config;
    private db;
    private logger;
    constructor(config: ConfigType<typeof configuration>, db: DatabaseService<any>, logger: Logger);
    getAllNotifications(userId: number): import("rxjs").Observable<any[]>;
    markNotificationsAsRead(userId: number, notificationList: [NotificationMarkAsReadRequestDto]): import("rxjs").Observable<any>;
}
