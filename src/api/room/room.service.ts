import configuration from 'src/config/configuration';
import { DatabaseService } from '../../database/database.service';
import { Logger } from 'src/shared/logger/logging.service';
import { UtilsService } from 'src/utils/utils.service';
import {filter ,from } from 'rxjs'
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

@Injectable()
export class RoomService {
    constructor(
        @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
        private db: DatabaseService<any>,
        private logger: Logger,
      ) {
        this.logger.setContext(RoomService.name);
      }

      CreatemessageRoom(senderid:number, receiverid:number,message:string) {
        return this.db.rawQuery(`INSERT INTO message (senderid, receiverid, message)
        VALUES ($1, $2, $3)`,[senderid,receiverid,message],null)
      }


      GetUser() {
        return this.db.rawQuery('select * from users',[],null)
      }


      GetSearchUser(text:any) {
        var result = this.db.rawQuery('select * from users',[],null)
        const source = from(result)
        const example = source.pipe(filter(str => str.name.toLowerCase().includes(text.toLowerCase()))
        // console.log(result)
        // var strggg = result.filter(str => str.name.toLowerCase().includes(text.toLowerCase()))
      }
}
