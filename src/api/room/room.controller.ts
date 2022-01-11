import { AuthUser } from 'src/utils/decorator/user-token-payload.decorator';
import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { DecodedTokenPayload } from '../auth/strategies/jwt.strategy';
import { RoomService } from './room.service';

@Controller('room')
export class RoomController {
    constructor(private readonly myService: RoomService) {} 

    @Post()
    CreateRoom(@Body('senderid') senderid : number,
               @Body('receiverid') receiverid:number,
               @Body('message') message:string ) {
        return this.myService.CreatemessageRoom(senderid,receiverid,message)
    }

    @Get()
    Getuser(){
        return this.myService.GetUser()
    }

    @Get('search')
    Getusers(@Query('text') text : any){
        return this.myService.GetSearchUser(text)
    }
}
