import { feedbacksSchema } from './schemas/feedbacks.schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FeedbacksController } from './controllers/feedbacks.controller';
import { FeedbacksService } from './services/feedbacks.service';

@Module({
  controllers: [FeedbacksController],
  imports: [
    MongooseModule.forFeature([{ name: 'feedbacks', schema: feedbacksSchema }]),
  ],
  providers: [FeedbacksService],
})
export class FeedbacksModule {}
