import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyController } from './technology.controller';
import { TechnologyService } from './technology.service';
import { technologySchema } from './technology.schema';

@Module({
  controllers: [TechnologyController],
  exports: [TechnologyService],
  imports: [
    MongooseModule.forFeature([
      { name: 'Technology', schema: technologySchema },
    ]),
  ],
  providers: [TechnologyService],
})
export class TechnologyModule {}
