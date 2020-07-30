import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectTypeController } from './project-type.controller';
import { ProjectTypeService } from './project-type.service';
import { typeSchema } from './project-type.schema';

@Module({
  controllers: [ProjectTypeController],
  exports: [ProjectTypeService],
  imports: [
    MongooseModule.forFeature([{ name: 'project-type', schema: typeSchema }]),
  ],
  providers: [ProjectTypeService],
})
export class ProjectTypeModule {}
