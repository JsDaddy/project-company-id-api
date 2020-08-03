import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { projectSchema } from './schemas/project.schema';

@Module({
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [
    MongooseModule.forFeature([{ name: 'project', schema: projectSchema }]),
  ],
  providers: [ProjectService],
})
export class ProjectModule {}
