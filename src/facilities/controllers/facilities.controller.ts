import { IFacilities } from '../interfaces/facilities.interface';
import { Controller, HttpStatus, Get, Res, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { FacilitiesService } from '../services/facilities.service';

@ApiTags('facilities')
@Controller('facilities')
export class FacilitiesController {
  public constructor(private readonly _facilitiesService: FacilitiesService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @ApiOperation({
    summary: 'Find facility.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found facility',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Facility not found',
  })
  @Get(':facility')
  public async findFacility(
    @Res() res: Response,
    @Param('facility') name: string,
  ): Promise<Response> {
    try {
      const facility: IFacilities | null = await this._facilitiesService.findFacility(
        name,
      );
      if (!facility) {
        return res
          .status(HttpStatus.NOT_FOUND)
          .json({ data: null, error: 'facility not found' });
      }
      return res.status(HttpStatus.OK).json({ data: facility, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }
  @ApiOperation({
    summary: 'Find facilities.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found facilities',
  })
  @Get()
  public async findFacilities(@Res() res: Response): Promise<Response> {
    try {
      const facilities: IFacilities[] = await this._facilitiesService.findFacilities();
      return res.status(HttpStatus.OK).json({ data: facilities, error: null });
    } catch (e) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }
}
