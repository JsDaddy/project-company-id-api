import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacationController } from './controllers/vacation.controller';
import { VacationService } from './services/vacation.service';
import { vacationSchema } from './schemas/vacation.schema';

@Module({
  controllers: [VacationController],
  exports: [VacationService],
  imports: [
    MongooseModule.forFeature([{ name: 'vacations', schema: vacationSchema }]),
  ],
  providers: [VacationService],
})
export class VacationModule {}
