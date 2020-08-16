import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TimelogController } from './controllers/timelog.controller';
import { TimelogService } from './services/timelog.service';
import { timelogSchema } from './schemas/timelog.schema';
import { vacationSchema } from 'src/vacation/schemas/vacation.schema';

@Module({
  controllers: [TimelogController],
  exports: [TimelogService],
  imports: [
    MongooseModule.forFeature([{ name: 'timelog', schema: timelogSchema }]),
    MongooseModule.forFeature([{ name: 'vacations', schema: vacationSchema }]),
  ],
  providers: [TimelogService],
})
export class TimelogModule {}
