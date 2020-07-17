import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NdaController } from './nda.controller';
import { NdaService } from './nda.service';
import { ndaSchema } from './nda.schema';

@Module({
  controllers: [NdaController],
  exports: [NdaService],
  imports: [MongooseModule.forFeature([{ name: 'Nda', schema: ndaSchema }])],
  providers: [NdaService],
})
export class NdaModule {}
