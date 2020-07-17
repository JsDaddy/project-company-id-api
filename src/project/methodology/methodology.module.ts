import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MethodologyController } from './methodology.controller';
import { MethodologyService } from './methodology.service';
import { methodologySchema } from './methodology.schema';

@Module({
  controllers: [MethodologyController],
  exports: [MethodologyService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Methodology', schema: methodologySchema },
    ]),
  ],
  providers: [MethodologyService],
})
export class MethodologyModule {}
