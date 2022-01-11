import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { addEmailLogDbQuery } from 'src/api/user/db-query/add-email-log.db-query';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import * as SendGridClient from '@sendgrid/mail';

import { Logger } from '../logger/logging.service';
import { ISendEmail } from '../ses/ses.service';

@Injectable()
export class SendgridService {
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private logger: Logger,
  ) {
    this.logger.setContext(SendgridService.name);
    SendGridClient.setApiKey(process.env.SENDGRID_API_KEY);
  }

  sendEmail({ email, userId, emailType }: ISendEmail) {
    return from(SendGridClient.send(email)).pipe(
      /**
       * Even if the email  got failed, We need to send signup success
       * response and store the email details with status as failed
       */
      catchError((error: SendGridClient.ResponseError): Observable<string> => {
        return of(error.message);
      }),
      switchMap(
        (
          response:
            | [SendGridClient.ClientResponse, Record<string, never>]
            | string,
        ) => {
          let isSuccess = true,
            failedReason = '';

          if (typeof response === 'string') {
            isSuccess = false;
            failedReason = response;
          }

          return this.db.rawQuery(
            addEmailLogDbQuery,
            [
              userId,
              emailType,
              email.from,
              email.to,
              email.subject,
              email.html,
              isSuccess,
              failedReason,
            ],
            null,
          );
        },
      ),
    );
  }
}
