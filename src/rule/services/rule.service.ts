import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { IRule } from '../interfaces/rule.interface';

@Injectable()
export class RuleService {
  public constructor(
    @InjectModel('rule') private readonly ruleModel: Model<IRule & Document>,
  ) {}
  public async findRules(): Promise<IRule[]> {
    return await this.ruleModel.find().lean().exec();
  }
}
