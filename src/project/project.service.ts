import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ProjectService {
  public constructor(
    @InjectModel('project') private readonly projectModel: Model<any>,
  ) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findProjects() {
    return this.projectModel
      .find({})
      .lean()
      .exec();
  }
}
