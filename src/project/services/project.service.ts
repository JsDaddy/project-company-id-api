import { ProjectStatus } from './../enums/project-status.enum';
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
import { CreateProjectDto } from '../dto/project.dto';
import { IUser } from 'src/auth/interfaces/user.interface';

@Injectable()
export class ProjectService {
  public stackLookup: Record<string, unknown> = {
    $lookup: {
      from: 'stacks',
      localField: 'stack',
      as: 'stack',
      foreignField: '_id',
    },
  };
  public constructor(
    @InjectModel('project')
    private readonly projectModel: Model<IProject & Document>,
    @InjectModel('users') private readonly _userModel: Model<IUser & Document>,
  ) {}

  public async findProjects(
    query: ProjectFilterDto,
    position: Positions,
  ): Promise<IProject[]> {
    const { stack, uid, isInternal, status } = query;
    let filterByUser: IFilterProjects = {};
    let filterByStack: IFilterProjects = {};
    let filterByActivity: IFilterProjects = {};
    let filterByInternal: IFilterProjects = {};
    let filterByStatus: IFilterProjects = {};
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
    if (status) {
      filterByStatus = { status };
    }
    return this.projectModel
      .aggregate([
        {
          $match: {
            ...filterByStack,
            ...filterByActivity,
            ...filterByInternal,
            ...filterByStatus,
          },
        },
        this.stackLookup,
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            as: 'users',
            foreignField: 'projects',
          },
        },
        {
          $match: filterByUser,
        },
        {
          $project: {
            _id: 1,
            name: 1,
            endDate: 1,
            startDate: 1,
            isActivity: 1,
            status: 1,
            isInternal: 1,
            'stack._id': 1,
            'stack.name': 1,
          },
        },
        {
          $sort: { endDate: 1, isInternal: 1, isActivity: 1 },
        },
      ])
      .exec();
  }

  public async archivateProject(
    _id: string,
    status: ProjectStatus,
  ): Promise<IProject | null> {
    return await this.projectModel.findOneAndUpdate(
      { _id: Types.ObjectId(_id) },
      [
        {
          $set: {
            endDate: new Date(),
          },
        },
        { $set: { status } },
      ],
      { upsert: true, new: true },
    );
  }

  public async createProject(project: CreateProjectDto): Promise<IProject> {
    const { users, ...projectDtoWithoutUsers } = project;

    const createdProject: IProject & Document = new this.projectModel({
      ...projectDtoWithoutUsers,
      status: ProjectStatus.ONGOING,
    });
    if (users) {
      await this.addUsersToTheProject(users, createdProject._id);
    }
    return createdProject.save();
  }
  public async addUsersToTheProject(
    ids: string[],
    projectId: Types.ObjectId,
  ): Promise<void> {
    for (const _id of ids) {
      await this._userModel.updateOne(
        {
          _id: Types.ObjectId(_id),
          activeProjects: { $ne: projectId },
          projects: { $ne: projectId },
        },
        { $push: { activeProjects: projectId, projects: projectId } },
      );
    }
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
          { $sort: { 'onboard.endDate': 1, 'history.endDate': 1 } },
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
              'onboard.endDate': 1,
              'history._id': 1,
              'history.name': 1,
              'history.lastName': 1,
              'history.position': 1,
              'history.endDate': 1,
              'history.avatar': 1,
              'stack._id': 1,
              'stack.name': 1,
            },
          },
        ])
        .exec()
    )[0];
  }

  public async findAbsentProjects(id: string): Promise<IProject> {
    let filterById: Record<string, unknown> = {};
    if (id) {
      filterById = { 'users._id': { $ne: Types.ObjectId(id) } };
    }
    return await this.projectModel
      .aggregate([
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            as: 'users',
            foreignField: 'projects',
          },
        },
        this.stackLookup,
        { $match: filterById },
        {
          $project: {
            _id: 1,
            name: 1,
            endDate: 1,
            startDate: 1,
            isInternal: 1,
            'stack._id': 1,
            'stack.name': 1,
          },
        },
      ])
      .exec();
  }

  public async findProjectFor(
    userId: string,
    isActive: boolean = false,
  ): Promise<Partial<IProject>[]> {
    const _id: Types.ObjectId = Types.ObjectId(userId);
    const article: string = isActive ? 'activeProjects' : 'projects';
    // tslint:disable-next-line:no-any
    const aggregate: any = await this._userModel.aggregate([
      { $match: { _id } },
      {
        $lookup: {
          as: article,
          foreignField: '_id',
          from: 'projects',
          localField: article,
        },
      },
      { $unwind: { path: '$' + article, preserveNullAndEmptyArrays: true } },

      {
        $group: {
          _id: '$_id',
          [article]: {
            $push: {
              _id: '$' + article + '._id',
              name: '$' + article + '.name',
            },
          },
        },
      },
    ]);
    return aggregate[0][article];
  }
}
