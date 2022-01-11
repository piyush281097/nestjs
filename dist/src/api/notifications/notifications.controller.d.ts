import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { NotificationMarkAsReadRequestDto } from './dto/mark-notification-as-read.dto';
import { NotificationsService } from './notifications.service';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(user: DecodedTokenPayload): import("rxjs").Observable<any[]>;
    create(user: DecodedTokenPayload, createPostDto: [NotificationMarkAsReadRequestDto]): import("rxjs").Observable<any>;
}
