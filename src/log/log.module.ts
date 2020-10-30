import { userSchema } from './../auth/schemas/user.schema';
import { VacationsService } from './../vacations/services/vacations.service';
import { DateService } from './services/date.service';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { timelogSchema } from '../timelogs/schemas/timelog.schema';
import { vacationSchema } from 'src/vacations/schemas/vacation.schema';
import { LogService } from './services/log.service';
import { LogController } from './controllers/log.controller';
import { holidaySchema } from './schemas/holiday.schema';

@Module({
  controllers: [LogController],
  exports: [LogService, DateService],
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'timelog', schema: timelogSchema }]),
    MongooseModule.forFeature([{ name: 'holidays', schema: holidaySchema }]),
    MongooseModule.forFeature([{ name: 'vacations', schema: vacationSchema }]),
  ],
  providers: [LogService, DateService, VacationsService],
})
export class LogModule {}
