import { CreateMailDto } from './../dto/mail.dto';
import * as nodemailer from 'nodemailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  private readonly _transporter: nodemailer.Transporter;
  private readonly _user: string = 'jsdaddy.notify@gmail.com';
  private readonly _pass: string = process.env.MAIL_PASS ?? '';

  public constructor() {
    this._transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: this._user,
        pass: this._pass,
      },
    });
  }

  public async sendMail(mail: CreateMailDto): Promise<{}> {
    return new Promise((res: Function, rej: Function) => {
      this._transporter.sendMail(
        {
          to: ['juncker8888@gmail.com', this._user, 'igornepipenko@gmail.com'],
          subject: 'JSDaddy',
          text: `Name:  ${mail.name}\nEmail: ${mail.email}\nText: ${mail.message}`,
          from: this._user,
        },
        (err: Error | null, info: nodemailer.SentMessageInfo) => {
          if (err) {
            return rej(err);
          }
          return res(info);
        },
      );
    });
  }
}
