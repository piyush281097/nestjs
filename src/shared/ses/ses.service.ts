import { AWSError, SES } from 'aws-sdk';
import { catchError, from, Observable, of, switchMap } from 'rxjs';
import { addEmailLogDbQuery } from 'src/api/user/db-query/add-email-log.db-query';
import configuration from 'src/config/configuration';
import { DatabaseService } from 'src/database/database.service';

import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';

import { Logger } from '../logger/logging.service';

interface EmailFormat {
  to: string;
  from: string;
  subject: string;
  text: string;
  html: string;
}

export interface ISendEmail {
  email: EmailFormat;
  userId: number;
  emailType: string;
}

@Injectable()
export class SesService {
  ses: SES;
  constructor(
    @Inject(configuration.KEY) private config: ConfigType<typeof configuration>,
    private db: DatabaseService<any>,
    private logger: Logger,
  ) {
    this.logger.setContext(SesService.name);
    this.ses = new SES({
      apiVersion: '2010-12-01',
      credentials: {
        accessKeyId: this.config.aws.accessKeyID,
        secretAccessKey: this.config.aws.secretAccessKey,
      },
      region: this.config.aws.region,
    });
  }

  sendEmail({ email, userId, emailType }: ISendEmail) {
    return from(
      this.ses
        .sendEmail({
          Destination: {
            CcAddresses: [],
            ToAddresses: [email.to],
          },
          Message: {
            Body: {
              Html: {
                Charset: 'UTF-8',
                Data: email.html,
              },
              Text: {
                Charset: 'UTF-8',
                Data: email.text,
              },
            },
            Subject: {
              Charset: 'UTF-8',
              Data: email.subject,
            },
          },
          Source: email.from,
          ReplyToAddresses: [email.from],
        })
        .promise(),
    ).pipe(
      /**
       * Even if the email  got failed, We need to send signup success
       * response and store the email details with status as failed
       */
      catchError((error: AWSError): Observable<string> => {
        return of(error.message);
      }),
      switchMap((response: SES.SendEmailResponse | string) => {
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
      }),
    );
  }
}
