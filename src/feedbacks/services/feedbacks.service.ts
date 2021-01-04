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

  public async findFeedbacks(): Promise<IFeedback[]> {
    return await this.feedbacksModel.find().lean().exec();
  }
}
