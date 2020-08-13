import * as mongoose from 'mongoose';
export interface IUser {
  _id: mongoose.Types.ObjectId;
  github: string;
  name: string;
  initialLogin: boolean;
  lastName: string;
  englishLevel: string;
  activeProjects: string[];
  role: string;
  skype: string;
  uid: string;
  avatar: string;
  email: string;
  position: string;
  phone: string;
  dob: any;
  password: string;
  accessToken: string;
}
