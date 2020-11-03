import { IStack } from './../interfaces/stack.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';

@Injectable()
export class StackService {
  public constructor(
    @InjectModel('stacks')
    private readonly _stackModel: Model<IStack & Document>,
  ) {}
  public async findStack(): Promise<IStack[]> {
    return await this._stackModel.find().lean().exec();
  }
}
