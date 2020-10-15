import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { Roles } from 'src/auth/enums/role.enum';
import { ProjectFilterDto } from '../dto/filter-projects.dto';
import { IProject } from '../interfaces/project.interface';

@Injectable()
export class ProjectService {
  public constructor(
    @InjectModel('project')
    private readonly projectModel: Model<IProject & Document>,
  ) {}

  public async findProjects(
    query: ProjectFilterDto,
    role: Roles,
  ): Promise<IProject[]> {
    const { stack, uid, isActivity, isInternal } = query;
    let filterByUser = {};
    let filterByStack = {};
    let filterByActivity = {};
    let filterByInternal = {};
    if (uid) {
      filterByUser = { 'users._id': Types.ObjectId(uid) };
    }
    if (stack) {
      filterByStack = { stack: Types.ObjectId(stack) };
    }
    if (role === Roles.USER) {
      filterByActivity = { isActivity: false };
    }
    if (isActivity && role === Roles.ADMIN) {
      filterByActivity = { isActivity: isActivity.toLowerCase() === 'true' };
    }
    if (isInternal) {
      filterByInternal = { isInternal: isInternal.toLowerCase() === 'true' };
    }
    return this.projectModel
      .aggregate([
        {
          $match: {
            $and: [filterByStack, filterByActivity, filterByInternal],
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
        { $unwind: { path: '$users', preserveNullAndEmptyArrays: false } },
        {
          $project: {
            _id: 1,
            name: 1,
            endDate: 1,
            isActivity: 1,
            isGreyOut: 1,
            isInternal: 1,
            'users._id': 1,
            'users.lastName': 1,
          },
        },
        {
          $match: filterByUser,
        },
        // { endDate: { $exists: true } },
        // {
        //   $set: {
        //     isGreyOut: {
        //       $cond: {
        //         if: { endDate:  },
        //         then: false,
        //         else: true,
        //       },
        //     },
        //   },
        // },
        {
          $sort: { endDate: 1, isInternal: 1, isActivity: 1 },
        },
      ])
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
