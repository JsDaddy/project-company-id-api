import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FacilitiesController } from './controllers/facilities.controller';
import { FacilitiesService } from './services/facilities.service';
import { facilitiesSchema } from './schemas/facilities.schema';

@Module({
  controllers: [FacilitiesController],
  exports: [FacilitiesService],
  imports: [
    MongooseModule.forFeature([
      { name: 'facilities', schema: facilitiesSchema },
    ]),
  ],
  providers: [FacilitiesService],
})
export class FacilitiesModule {}
