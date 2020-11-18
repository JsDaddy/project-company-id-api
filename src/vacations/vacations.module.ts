import { SlackModule } from './../shared/slack.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { vacationSchema } from './schemas/vacation.schema';
import { VacationsService } from './services/vacations.service';
import { VacationsController } from './controllers/vacations.controller';
import { DateService } from 'src/log/services/date.service';
import { userSchema } from 'src/auth/schemas/user.schema';

@Module({
  controllers: [VacationsController],
  exports: [VacationsService],
  imports: [
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'vacations', schema: vacationSchema }]),
    SlackModule,
  ],
  providers: [VacationsService, DateService],
})
export class VacationsModule {}
