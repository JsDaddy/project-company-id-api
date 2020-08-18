import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { timelogSchema } from './schemas/timelog.schema';
import { vacationSchema } from 'src/vacation/schemas/vacation.schema';
import { LogService } from './services/log.service';
import { LogController } from './controllers/log.controller';

@Module({
  controllers: [LogController],
  exports: [LogService],
  imports: [
    MongooseModule.forFeature([{ name: 'timelog', schema: timelogSchema }]),
    MongooseModule.forFeature([{ name: 'vacations', schema: vacationSchema }]),
  ],
  providers: [LogService],
})
export class LogModule {}
