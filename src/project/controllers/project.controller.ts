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
import { CreateProjectDto } from 'src/rule/dto/rule.dto';
import { Response } from 'express';
import { IProject } from '../schemas/project.schema';

@ApiTags('projects')
@Controller('projects')
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
  public async findProjects(@Res() res: Response): Promise<Response> {
    try {
      const projects: Partial<
        IProject
      >[] = await this.projectService.findProjects();
      return res.status(HttpStatus.OK).json({ data: projects, error: null });
    } catch (e) {
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
  async findByUser(@Param('uid') uid: string): Promise<any[]> {
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
  async createProject(@Body() project: CreateProjectDto): Promise<any> {
    return this.projectService.createProject(project);
  }
}
