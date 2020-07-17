import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelogController } from './timelog.controller';
import { TimelogService } from './timelog.service';
import { timelogSchema } from './timelog.schema';

@Module({
  controllers: [TimelogController],
  exports: [TimelogService],
  imports: [
    MongooseModule.forFeature([{ name: 'Timelog', schema: timelogSchema }]),
  ],
  providers: [TimelogService],
})
export class TimelogModule {}
