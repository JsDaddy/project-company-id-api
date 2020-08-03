/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {
  Controller,
  HttpStatus,
  Get,
  Res,
  Body,
  Param,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { ProjectDto } from 'src/rule/dto/rule.dto';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  public constructor(private readonly projectService: ProjectService) {}

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

  @ApiOperation({
    summary: 'Find projects by uid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found projects',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @Get('findByUid/:uid')
  async findByUser(@Param('uid') uid: string): Promise<ProjectDto[]> {
    return this.projectService.findByUser(uid);
  }

  @ApiOperation({
    summary: 'Create new project',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success add project',
  })
  @Post()
  async createProject(@Body() project: ProjectDto): Promise<any> {
    return this.projectService.createProject(project);
  }
}
