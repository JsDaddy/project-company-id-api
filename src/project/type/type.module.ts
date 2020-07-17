import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { typeSchema } from './type.schema';

@Module({
  controllers: [TypeController],
  exports: [TypeService],
  imports: [MongooseModule.forFeature([{ name: 'Type', schema: typeSchema }])],
  providers: [TypeService],
})
export class TypeModule {}
