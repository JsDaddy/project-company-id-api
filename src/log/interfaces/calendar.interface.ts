import { IHoliday } from './../schemas/holiday.schema';
import { IVacation } from './../../vacations/schemas/vacation.schema';
import { ITimelog } from './../../timelogs/schemas/timelog.schema';
export interface ICalendar {
  timelogs: Partial<ITimelog>[];
  vacations: Partial<IVacation>[];
  holidays: Partial<IHoliday>[];
}
