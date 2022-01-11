import { OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from "@nestjs/websockets";
import { Socket, Server } from 'socket.io';
export declare class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    private logger;
    afterInit(server: Server): void;
    handleDisconnect(client: Socket): Promise<void>;
    handleConnection(client: Socket, ...args: any[]): Promise<void>;
    handlemessage(client: Socket, message: string): void;
}
