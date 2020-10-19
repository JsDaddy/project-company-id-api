import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './controllers/project.controller';
import { ProjectService } from './services/project.service';
import { projectSchema } from './schemas/project.schema';
import { userSchema } from 'src/auth/schemas/user.schema';

@Module({
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [
    MongooseModule.forFeature([{ name: 'project', schema: projectSchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
  ],
  providers: [ProjectService],
})
export class ProjectModule {}
