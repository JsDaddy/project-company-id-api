import { Positions } from 'src/auth/enums/positions.enum';
import { SignUpDto } from './../dto/signup.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types, Document } from 'mongoose';
import { IUser } from '../interfaces/user.interface';
import { IProject } from 'src/project/interfaces/project.interface';

@Injectable()
export class UserService {
  public constructor(
    @InjectModel('users') private readonly _userModel: Model<IUser & Document>,
  ) {}

  public async createUser(user: SignUpDto): Promise<IUser> {
    const createdUser: IUser & Document = new this._userModel(user);
    return createdUser.save();
  }

  public async findUsers(): Promise<IUser[]> {
    return this._userModel.aggregate([
      {
        $lookup: {
          as: 'projects',
          foreignField: '_id',
          from: 'projects',
          localField: 'projects',
        },
      },
      { $unwind: { path: '$projects', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          as: 'activeProjects',
          foreignField: '_id',
          from: 'projects',
          localField: 'activeProjects',
        },
      },
      {
        $unwind: { path: '$activeProjects', preserveNullAndEmptyArrays: true },
      },
      {
        $group: {
          _id: '$_id',
          avatar: { $first: '$avatar' },
          lastName: { $first: '$lastName' },
          name: { $first: '$name' },
          projects: { $push: '$projects' },
          activeProjects: { $push: '$activeProjects' },
        },
      },
    ]);
  }

  public async getUsers(role: Positions): Promise<IUser[]> {
    const filterByUser: { isActive: boolean } = {
      isActive: true,
    };

    return this._userModel.aggregate([
      { $match: role === Positions.DEVELOPER ? filterByUser : {} },
      {
        $project: {
          name: 1,
          lastName: 1,
          avatar: 1,
          position: 1,
        },
      },
    ]);
  }

  public async addUserToTheProject(
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
    isActive: boolean = false,
  ): Promise<void> {
    // tslint:disable-next-line:no-any
    const match: any = isActive ? { $ne: projectId } : projectId;
    // tslint:disable-next-line:no-any
    const push: any = isActive
      ? { activeProjects: projectId }
      : { activeProjects: projectId, projects: projectId };
    await this._userModel.updateOne(
      { _id, activeProjects: { $ne: projectId }, projects: match },
      { $push: push },
    );
  }
  public async removeUserFromProject(
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<void> {
    await this._userModel.updateOne(
      { _id },
      { $pull: { activeProjects: projectId, projects: projectId } },
    );
  }
  public async removeUserFromActiveProject(
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<void> {
    await this._userModel.updateOne(
      { _id },
      { $pull: { activeProjects: projectId } },
    );
  }
  // TODO
  public async findUser(_id: string): Promise<IUser<IProject[]>> {
    return (
      await this._userModel.aggregate([
        { $match: { _id: Types.ObjectId(_id) } },
        {
          $lookup: {
            as: 'projects',
            foreignField: '_id',
            from: 'projects',
            localField: 'projects',
          },
        },

        { $unwind: { path: '$projects', preserveNullAndEmptyArrays: true } },
        {
          $lookup: {
            from: 'stack',
            localField: 'projects.stack',
            as: 'projects.stack',
            foreignField: '_id',
          },
        },
        {
          $unwind: {
            path: '$projects.stack',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              _id: '$_id',
              projectId: '$projects._id',
            },
            name: { $first: '$name' },
            avatar: { $first: '$avatar' },
            lastName: { $first: '$lastName' },
            position: { $first: '$position' },
            phone: { $first: '$phone' },
            skype: { $first: '$skype' },
            dob: { $first: '$dob' },
            github: { $first: '$github' },
            englishLevel: { $first: '$englishLevel' },
            email: { $first: '$email' },
            activeProjects: { $first: '$activeProjects' },
            project: {
              $first: {
                _id: '$projects._id',
                name: '$projects.name',
                startDate: '$projects.startDate',
                endDate: '$projects.endDate',
                isInternal: '$projects.isInternal',
              },
            },

            stack: { $push: '$projects.stack' },
          },
        },

        {
          $group: {
            _id: '$_id._id',
            name: { $first: '$name' },
            avatar: { $first: '$avatar' },
            lastName: { $first: '$lastName' },
            position: { $first: '$position' },
            phone: { $first: '$phone' },
            skype: { $first: '$skype' },
            dob: { $first: '$dob' },
            github: { $first: '$github' },
            englishLevel: { $first: '$englishLevel' },
            email: { $first: '$email' },
            activeProjects: { $first: '$activeProjects' },
            projects: {
              $push: {
                _id: '$project._id',
                name: '$project.name',
                startDate: '$project.startDate',
                endDate: '$project.endDate',
                isInternal: '$project.isInternal',
                stack: '$stack',
              },
            },
          },
        },

        {
          $lookup: {
            as: 'activeProjects',
            foreignField: '_id',
            from: 'projects',
            localField: 'activeProjects',
          },
        },

        {
          $unwind: {
            path: '$activeProjects',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $lookup: {
            from: 'stack',
            localField: 'activeProjects.stack',
            as: 'activeProjects.stack',
            foreignField: '_id',
          },
        },
        {
          $unwind: {
            path: '$activeProjects.stack',
            preserveNullAndEmptyArrays: true,
          },
        },

        {
          $group: {
            _id: {
              _id: '$_id',
              activeProjectId: '$activeProjects._id',
            },
            name: { $first: '$name' },
            avatar: { $first: '$avatar' },
            lastName: { $first: '$lastName' },
            position: { $first: '$position' },
            phone: { $first: '$phone' },
            skype: { $first: '$skype' },
            dob: { $first: '$dob' },
            github: { $first: '$github' },
            englishLevel: { $first: '$englishLevel' },
            email: { $first: '$email' },
            activeProjects: {
              $first: {
                _id: '$activeProjects._id',
                name: '$activeProjects.name',
                startDate: '$activeProjects.startDate',
                endDate: '$activeProjects.endDate',
                isInternal: '$activeProjects.isInternal',
              },
            },
            projects: {
              $first: '$projects',
            },

            stack: { $push: '$activeProjects.stack' },
          },
        },

        {
          $group: {
            _id: '$_id._id',
            name: { $first: '$name' },
            avatar: { $first: '$avatar' },
            lastName: { $first: '$lastName' },
            position: { $first: '$position' },
            phone: { $first: '$phone' },
            skype: { $first: '$skype' },
            dob: { $first: '$dob' },
            github: { $first: '$github' },
            englishLevel: { $first: '$englishLevel' },
            email: { $first: '$email' },
            projects: { $first: '$projects' },
            activeProjects: {
              $push: {
                _id: '$activeProjects._id',
                name: '$activeProjects.name',
                startDate: '$activeProjects.startDate',
                endDate: '$activeProjects.endDate',
                isInternal: '$activeProjects.isInternal',
                stack: '$stack',
              },
            },
          },
        },
      ])
    )[0];
  }

  public async findUsersFor(projectId: string): Promise<Partial<IUser>[]> {
    const _id: Types.ObjectId = Types.ObjectId(projectId);
    const users: Partial<IUser>[] = await this._userModel.aggregate([
      { $match: { projects: _id } },
      {
        $project: {
          _id: 1,
          name: 1,
          lastName: 1,
        },
      },
    ]);
    return users;
  }
}
