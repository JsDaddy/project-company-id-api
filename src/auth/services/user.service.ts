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
  public async addUserToTheProject(
    _id: Types.ObjectId,
    projectId: Types.ObjectId,
  ): Promise<void> {
    await this._userModel.updateOne(
      { _id, activeProjects: { $ne: projectId }, projects: { $ne: projectId } },
      { $push: { activeProjects: projectId, projects: projectId } },
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
          $project: {
            _id: 1,
            avatar: 1,
            lastName: 1,
            name: 1,
            position: 1,
            phone: 1,
            skype: 1,
            dob: 1,
            github: 1,
            englishLevel: 1,
            email: 1,
            'projects._id': 1,
            'projects.name': 1,
            'projects.startDate': 1,
            'projects.endDate': 1,
            'projects.stack': 1,
            'activeProjects.name': 1,
            'activeProjects.stack': 1,
            'activeProjects._id': 1,
            'activeProjects.startDate': 1,
            'activeProjects.endDate': 1,
          },
        },
      ])
    )[0];
  }
}
