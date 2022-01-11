import { RoomService } from './room.service';
export declare class RoomController {
    private readonly myService;
    constructor(myService: RoomService);
    CreateRoom(senderid: number, receiverid: number, message: string): import("rxjs").Observable<any[]>;
    Getuser(): import("rxjs").Observable<any[]>;
    Getusers(text: any): void;
}
