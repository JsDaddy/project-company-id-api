import { TimelogsService } from './services/timelogs.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { timelogSchema } from 'src/timelogs/schemas/timelog.schema';
import { TimelogsController } from './controllers/timelogs.controller';
import { DateService } from 'src/log/services/date.service';

@Module({
  controllers: [TimelogsController],
  exports: [TimelogsService],
  imports: [
    MongooseModule.forFeature([{ name: 'timelog', schema: timelogSchema }]),
  ],
  providers: [TimelogsService, DateService],
})
export class TimelogsModule {}
