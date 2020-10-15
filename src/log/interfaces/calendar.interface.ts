import { IVacation } from './../../vacations/interfaces/vacation.interface';
import { ITimelog } from './../../../scripts/interfaces/timelog.interface';
import { IHoliday } from './holiday.interface';

export interface ICalendar {
  timelogs: ITimelog[];
  vacations: IVacation[];
  holidays: IHoliday[];
}
