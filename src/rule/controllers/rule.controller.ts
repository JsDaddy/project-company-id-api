import { Controller, HttpStatus, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RuleService } from '../services/rule.service';

@ApiTags('rule')
@Controller('rule')
export class RuleController {
  public constructor(private readonly ruleService: RuleService) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  @ApiOperation({
    summary: 'Find all rules.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found rules',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Record not found',
  })
  @Get()
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  public async findRules(@Res() res: any) {
    try {
      const rules = await this.ruleService.findRules();
      return res.status(HttpStatus.OK).json({ data: rules, error: null });
    } catch (e) {
      console.log(e);
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, e });
    }
  }
}
