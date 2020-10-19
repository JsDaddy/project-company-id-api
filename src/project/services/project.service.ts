import { Positions } from 'src/auth/enums/positions.enum';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { ProjectFilterDto } from '../dto/filter-projects.dto';
import {
  IFilterProject,
  IFilterProjects,
} from '../interfaces/filters.interface';
import { IProject } from '../interfaces/project.interface';

@Injectable()
export class ProjectService {
  public stackLookup: Record<string, unknown> = {
    $lookup: {
      from: 'stack',
      localField: 'stack',
      as: 'stack',
      foreignField: '_id',
    },
  };
  public constructor(
    @InjectModel('project')
    private readonly projectModel: Model<IProject & Document>,
  ) {}

  public async findProjects(
    query: ProjectFilterDto,
    position: Positions,
  ): Promise<IProject[]> {
    const { stack, uid, onGoing, isInternal } = query;
    let filterByUser: IFilterProjects = {};
    let filterByStack: IFilterProjects = {};
    let filterByActivity: IFilterProjects = {};
    let filterByInternal: IFilterProjects = {};
    let filterByOnGoing: IFilterProjects = {};
    if (onGoing) {
      filterByOnGoing = { endDate: { $exists: onGoing === 'false' } };
    }
    if (uid) {
      filterByUser = { 'users._id': Types.ObjectId(uid) };
    }
    if (stack) {
      filterByStack = { stack: Types.ObjectId(stack) };
    }
    if (position === Positions.DEVELOPER) {
      filterByActivity = { isActivity: false };
    }

    if (isInternal) {
      filterByInternal = { isInternal: isInternal.toLowerCase() === 'true' };
    }
    return this.projectModel
      .aggregate([
        {
          $match: {
            $and: [
              filterByStack,
              filterByActivity,
              filterByInternal,
              filterByOnGoing,
            ],
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            as: 'users',
            foreignField: 'projects',
          },
        },
        this.stackLookup,
        {
          $project: {
            _id: 1,
            name: 1,
            endDate: 1,
            startDate: 1,
            isActivity: 1,
            isGreyOut: 1,
            isInternal: 1,
            'users._id': 1,
            'stack._id': 1,
            'stack.name': 1,
          },
        },
        {
          $match: filterByUser,
        },
        { $unset: 'users' },
        {
          $sort: { endDate: 1, isInternal: 1, isActivity: 1 },
        },
      ])
      .exec();
  }

  public async createProject(project: any): Promise<IProject> {
    const createdProject = new this.projectModel(project);
    return createdProject.save();
  }

  public async findById(id: string): Promise<IProject> {
    let filterById: Partial<IFilterProject> = {};
    if (id) {
      filterById = { _id: Types.ObjectId(id) };
    }
    return (
      await this.projectModel
        .aggregate([
          { $match: filterById },
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              as: 'history',
              foreignField: 'projects',
            },
          },
          this.stackLookup,
          {
            $lookup: {
              from: 'users',
              localField: '_id',
              as: 'onboard',
              foreignField: 'activeProjects',
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              endDate: 1,
              industry: 1,
              customer: 1,
              startDate: 1,
              'onboard._id': 1,
              'onboard.name': 1,
              'onboard.lastName': 1,
              'onboard.position': 1,
              'onboard.avatar': 1,
              'history._id': 1,
              'history.name': 1,
              'history.lastName': 1,
              'history.position': 1,
              'history.avatar': 1,
              'stack._id': 1,
              'stack.name': 1,
            },
          },
        ])
        .exec()
    )[0];
  }
}
