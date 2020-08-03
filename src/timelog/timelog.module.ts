import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelogController } from './controllers/timelog.controller';
import { TimelogService } from './services/timelog.service';
import { timelogSchema } from './schemas/timelog.schema';

@Module({
  controllers: [TimelogController],
  exports: [TimelogService],
  imports: [
    MongooseModule.forFeature([{ name: 'timelog', schema: timelogSchema }]),
  ],
  providers: [TimelogService],
})
export class TimelogModule {}
