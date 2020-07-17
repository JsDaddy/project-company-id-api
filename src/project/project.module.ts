import { ServiceModule } from './service/service.module';
import { NdaModule } from './nda/nda.module';
import { MethodologyModule } from './methodology/methodology.module';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { projectSchema } from './project.schema';
import { TypeModule } from './type/type.module';

@Module({
  controllers: [ProjectController],
  exports: [ProjectService],
  imports: [
    MethodologyModule,
    NdaModule,
    ServiceModule,
    TypeModule,
    MongooseModule.forFeature([{ name: 'Project', schema: projectSchema }]),
  ],
  providers: [ProjectService],
})
export class ProjectModule {}
