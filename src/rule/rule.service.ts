import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RuleService {
  public constructor(
    @InjectModel('rule') private readonly ruleModel: Model<any>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findRules() {
    return this.ruleModel
      .find({})
      .lean()
      .exec();
  }
}
