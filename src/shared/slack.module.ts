import { SlackService } from './services/slack.service';

import { Module, HttpModule } from '@nestjs/common';

@Module({
  exports: [SlackService],
  imports: [HttpModule],
  providers: [SlackService],
})
export class SlackModule {}
