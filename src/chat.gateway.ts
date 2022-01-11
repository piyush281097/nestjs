import { WebSocketServer,MessageBody,OnGatewayInit, SubscribeMessage, WebSocketGateway,OnGatewayConnection, OnGatewayDisconnect,ConnectedSocket } from "@nestjs/websockets"
import { Logger } from '@nestjs/common';
import {Socket,Server} from 'socket.io';
@WebSocketGateway()
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    @WebSocketServer()server:Server;
    private logger: Logger = new Logger('AppGateway');
    afterInit(server: Server) {
        this.logger.log('Init');
    }
    async  handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }
    async  handleConnection(client: Socket, ...args: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
    @SubscribeMessage('message')
    handlemessage(client:Socket, message:string): void {
        this.server.emit('message',message);
    }
}