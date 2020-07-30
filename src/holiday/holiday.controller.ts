import { Controller, HttpStatus, Post, Body, Get, Res } from '@nestjs/common';
import { HolidayService } from './holiday.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HolidayDto } from './holiday.dto';

@ApiTags('holiday')
@Controller('Holiday')
export class HolidayController {
  public constructor(private readonly holidayService: HolidayService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @ApiOperation({
    summary: 'Find all holidays.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found holidays',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Record not found',
  })
  @Get()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findHolidays(@Res() res: any) {
    try {
      const holidays = await this.holidayService.findHolidays();
      return res.status(HttpStatus.OK).json({ data: holidays, error: null });
    } catch (e) {
      console.log(e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }

  @ApiOperation({
    summary: 'Create new holiday',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success add holiday',
  })
  @Post()
  async createHoliday(@Body() holiday: HolidayDto): Promise<any> {
    return this.holidayService.createHoliday(holiday);
  }
}
