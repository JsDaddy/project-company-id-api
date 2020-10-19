import * as mongoose from 'mongoose';
export interface IUserFb {
  _id: mongoose.Types.ObjectId;
  github: string;
  name: string;
  initialLogin: boolean;
  lastName: string;
  englishLevel: string;
  activeProjects: mongoose.Types.ObjectId[];
  projects: mongoose.Types.ObjectId[];
  role?: string;
  skype: string;
  uid?: string;
  avatar: string;
  email: string;
  position: string;
  phone: string;
  dob: any;
  password: string;
  accessToken: string;
  isActive: boolean;
}
