import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ServiceController } from './service.controller';
import { ServiceService } from './service.service';
import { serviceSchema } from './service.schema';

@Module({
  controllers: [ServiceController],
  exports: [ServiceService],
  imports: [
    MongooseModule.forFeature([{ name: 'Service', schema: serviceSchema }]),
  ],
  providers: [ServiceService],
})
export class ServiceModule {}
