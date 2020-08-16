/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { ProjectDto } from 'src/rule/dto/rule.dto';

@Injectable()
export class ProjectService {
  public constructor(
    @InjectModel('project') private readonly projectModel: Model<any>,
  ) {}

  public async findProjects() {
    return this.projectModel
      .find({})
      .lean()
      .exec();
  }

  public async createProject(project: any): Promise<any> {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }

  public async findByUser(uid: string): Promise<any[]> {
    return await this.projectModel.aggregate([{ $match: { uid: uid } }]);
  }
}
