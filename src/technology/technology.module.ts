import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TechnologyController } from './controllers/technology.controller';
import { TechnologyService } from './services/technology.service';
import { technologySchema } from './schemas/technology.schema';

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
