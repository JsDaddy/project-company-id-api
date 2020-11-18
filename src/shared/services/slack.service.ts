import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class SlackService {
  public constructor(private readonly _http: HttpService) {}
  public async sendMessage(channel: string, message: string): Promise<boolean> {
    // tslint:disable-next-line:no-any
    if (!process.env.BOT_TOKEN) {
      return false;
    }
    const res: any = await this._http
      .post(
        'https://slack.com/api/chat.postMessage',
        { channel, text: ` \`\`\`${message}\`\`\`` },
        {
          responseType: 'json',
          timeout: 5000,
          headers: {
            Authorization: `Bearer ${process.env.BOT_TOKEN}`,
          },
        },
      )
      .toPromise();

    return res.data['ok'] === 'true';
  }
}
