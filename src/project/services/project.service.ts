import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
import { IProject } from '../interfaces/project.interface';

@Injectable()
export class ProjectService {
  public constructor(
    @InjectModel('project')
    private readonly projectModel: Model<IProject & Document>,
  ) {}

  public async findProjects(): Promise<IProject[]> {
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
