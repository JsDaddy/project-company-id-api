import { IFacilities } from './../interfaces/facilities.interface';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document } from 'mongoose';
@Injectable()
export class FacilitiesService {
  public constructor(
    @InjectModel('facilities')
    private readonly facilitiesModel: Model<IFacilities & Document>,
  ) {}

  public async findFacility(facility: string): Promise<IFacilities | null> {
    return await this.facilitiesModel.findOne({ name: facility });
  }
}
