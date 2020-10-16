import { ChangeStatusDto, StatusType } from './../dto/change-status.dto';
import { CreateVacationDto, VacationType } from './../dto/create-vacation.dto';
import { IVacation } from 'src/vacations/interfaces/vacation.interface';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Document, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class VacationsService {
  public constructor(
    @InjectModel('vacations')
    private readonly _vacationModel: Model<IVacation & Document>,
  ) {}

  public async createVacation(
    createVacationDto: CreateVacationDto & { uid: Types.ObjectId },
  ): Promise<IVacation> {
    const type: number = parseInt(VacationType[createVacationDto.type]);
    return await this._vacationModel.create({
      ...createVacationDto,
      status: StatusType.PENDING,
      type,
    });
  }

  public async statusChange(
    _id: Types.ObjectId,
    changeStatusDto: ChangeStatusDto,
  ): Promise<IVacation | null> {
    const { status } = changeStatusDto;

    return await this._vacationModel
      .findOneAndUpdate(
        { _id },
        { $set: { status: status.toLowerCase() } },
        { new: true },
      )
      .lean()
      .exec();
  }
}
