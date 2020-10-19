import { ProjectStatus } from './../enums/project-status.enum';
import { Types } from 'mongoose';

export interface IFilterProjects {
  'users._id'?: Types.ObjectId;
  isActivity?: boolean;
  isInternal?: boolean;
  status?: ProjectStatus;
  stack?: Types.ObjectId;
  endDate?: { $exists: boolean };
}
export interface IFilterProject {
  _id?: Types.ObjectId;
}
