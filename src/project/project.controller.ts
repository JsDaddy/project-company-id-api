import { Controller, HttpStatus, Get, Res } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectService } from './project.service';

@ApiTags('project')
@Controller('project')
export class ProjectController {
    public constructor(private readonly projectService: ProjectService) {}

    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    @ApiOperation({
      summary: 'Find all projects.',
    })
    @ApiResponse({
      status: HttpStatus.OK,
      description: 'Found projects',
    })
    @ApiResponse({
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      description: 'Record not found',
    })
    @Get()
    // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
    public async findProjects(@Res() res: any) {
      try {
        const projects = await this.projectService.findProjects();
        return res.status(HttpStatus.OK).json({ data: projects, error: null });
      } catch (e) {
        console.log(e);
        return res
          .status(HttpStatus.INTERNAL_SERVER_ERROR)
          .json({ data: null, e });
      }
    }
}
