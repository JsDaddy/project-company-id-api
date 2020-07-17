import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacationController } from './vacation.controller';
import { VacationService } from './vacation.service';
import { vacationSchema } from './vacation.schema';
import { VacationTypeModule } from './vacation-type/vacation-type.module';

@Module({
  controllers: [VacationController],
  exports: [VacationService],
  imports: [
    VacationTypeModule,
    MongooseModule.forFeature([{ name: 'Vacation', schema: vacationSchema }]),
  ],
  providers: [VacationService],
})
export class VacationModule {}
