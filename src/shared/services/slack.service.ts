import { Injectable, HttpService } from '@nestjs/common';

@Injectable()
export class SlackService {
  public constructor(private readonly _http: HttpService) {}
  public async sendMessage(channel: string, message: string): Promise<boolean> {
    // tslint:disable-next-line:no-any
    const res: any = await this._http
      .post(
        'https://slack.com/api/chat.postMessage',
        { channel, text: message },
        {
          responseType: 'json',
          timeout: 5000,
          headers: {
            Authorization:
              'Bearer xoxb-200421297187-1530498242480-YIwExJ5JTvRVBe5btwXg9qgN',
          },
        },
      )
      .toPromise();
    return res.date['ok'] === 'true';
  }
}
