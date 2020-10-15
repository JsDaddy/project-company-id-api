import { Types } from 'mongoose';

export interface IUser<P = Types.ObjectId[]> {
  _id: Types.ObjectId;
  email: string;
  name: string;
  lastName: string;
  role: string;
  dob: Date;
  englishLevel: string;
  password?: string;
  github: string;
  initialLogin?: boolean;
  accessToken?: string;
  position: string;
  avatar: string;
  phone: string;
  skype: string;
  activeProjects?: P;
  projects?: P;
}
