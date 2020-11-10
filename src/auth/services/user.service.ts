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
    @InjectModel('projects')
    private readonly _projectsModel: Model<IProject & Document>,
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

  public async getUsers(isNotFired: boolean): Promise<IUser[]> {
    const filterByUser: Record<string, unknown> = {
      endDate: { $exists: false },
    };

    return this._userModel.aggregate([
      { $match: isNotFired ? filterByUser : {} },
      { $sort: { endDate: 1 } },
      {
        $project: {
          name: 1,
          lastName: 1,
          avatar: 1,
          position: 1,
          endDate: 1,
        },
      },
    ]);
  }

  public async addUserToTheProject(
    id: Types.ObjectId,
    projectId: Types.ObjectId,
    isActive: boolean,
  ): Promise<Partial<IUser> | null> {
    const match: Record<string, unknown> | Types.ObjectId = !isActive
      ? { $ne: projectId }
      : projectId;
    const push: Record<string, unknown> = isActive
      ? { activeProjects: projectId }
      : { activeProjects: projectId, projects: projectId };
    const user: IUser | null = await this._userModel.findOneAndUpdate(
      { _id: id, activeProjects: { $ne: projectId }, projects: match },
      { $push: push },
    );
    if (user) {
      const { _id, name, lastName, avatar, position, endDate } = user;
      return { _id, name, lastName, avatar, position, endDate };
    }
    return null;
  }
  public async addUserToTheProjectWithReturn(
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
    isActive: boolean,
  ): Promise<Partial<IProject> | null> {
    const match: Record<string, unknown> | Types.ObjectId = isActive
      ? projectId
      : { $ne: projectId };
    const push: Record<string, unknown> = isActive
      ? { activeProjects: projectId }
      : { activeProjects: projectId, projects: projectId };
    const user: IUser | null = await this._userModel.findOneAndUpdate(
      { _id, activeProjects: { $ne: projectId }, projects: match },
      { $push: push },
    );

    if (!user) {
      return null;
    }

    return (
      await this._projectsModel
        .aggregate([
          { $match: { _id: projectId } },
          {
            $lookup: {
              from: 'stacks',
              localField: 'stack',
              as: 'stack',
              foreignField: '_id',
            },
          },
          {
            $project: {
              _id: 1,
              name: 1,
              endDate: 1,
              startDate: 1,
              'stack._id': 1,
              'stack.name': 1,
            },
          },
        ])
        .exec()
    )[0];
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

  public async getUser(_id: string): Promise<IUser | null> {
    return await this._userModel.findOne({ _id: Types.ObjectId(_id) });
  }
  public async archivateUser(_id: string): Promise<IUser | null> {
    return await this._userModel.findOneAndUpdate(
      { _id: Types.ObjectId(_id) },
      [{ $set: { endDate: new Date() } }, { $set: { activeProjects: [] } }],
      { new: true },
    );
  }

  public async findUsersByStack(_sid: string): Promise<Partial<IUser>[]> {
    return await this._userModel.aggregate([
      {
        $lookup: {
          as: 'projects',
          foreignField: '_id',
          from: 'projects',
          localField: 'projects',
        },
      },
      { $match: { 'projects.stack': Types.ObjectId(_sid) } },
      {
        $project: {
          _id: 1,
          name: 1,
          lastName: 1,
        },
      },
    ]);
  }

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
            from: 'stacks',
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
            from: 'stacks',
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
        {
          $sort: {
            'activeProjects.endDate': 1,
            'activeProjects.isInternal': 1,
            'projects.endDate': 1,
            'projects.isInternal': 1,
          },
        },
      ])
    )[0];
  }

  public async findUsersFor(
    projectId: string,
    isActive: boolean = false,
  ): Promise<Partial<IUser>[]> {
    const _id: Types.ObjectId = Types.ObjectId(projectId);
    const match: Record<string, unknown> = {
      $match: isActive
        ? { endDate: null, projects: { $ne: _id } }
        : { endDate: null, projects: _id },
    };
    const users: Partial<IUser>[] = await this._userModel.aggregate([
      match,
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
