import { ProjectStatus } from './../enums/project-status.enum';
import { Types } from 'mongoose';

export interface IProject {
  _id: Types.ObjectId;
  name: string;
  techId: string;
  industry: string;
  customer: string;
  startDate: Date;
  endDate?: Date;
  status: ProjectStatus;
  isInternal: boolean;
  isActivity: boolean;
  stack: Types.ObjectId[];
}
