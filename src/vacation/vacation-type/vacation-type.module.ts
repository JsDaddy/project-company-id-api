import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { VacationTypeController } from './vacation-type.controller';
import { VacationTypeService } from './vacation-type.service';
import { vacationTypeSchema } from './vacation-type.schema';

@Module({
  controllers: [VacationTypeController],
  exports: [VacationTypeService],
  imports: [
    MongooseModule.forFeature([
      { name: 'VacationType', schema: vacationTypeSchema },
    ]),
  ],
  providers: [VacationTypeService],
})
export class VacationTypeModule {}
