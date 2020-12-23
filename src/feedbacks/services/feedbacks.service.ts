import { IFeedback } from './../interfaces/feedbacks.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
@Injectable()
export class FeedbacksService {
  public constructor(
    @InjectModel('feedbacks')
    private readonly feedbacksModel: Model<IFeedback & Document>,
  ) {}

  public async findFeedback(feedback: string): Promise<IFeedback | null> {
    return await this.feedbacksModel.findOne({ name: feedback });
  }
}
