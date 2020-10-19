import { Positions } from 'src/auth/enums/positions.enum';
import {
  Controller,
  HttpStatus,
  Get,
  Res,
  Body,
  Param,
  Post,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { Request, Response } from 'express';
import { IProject } from '../interfaces/project.interface';
import { ProjectFilterDto } from '../dto/filter-projects.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/shared/guards/roles.guard';
import { IUser } from 'src/auth/interfaces/user.interface';
import { CreateProjectDto } from '../dto/project.dto';

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
  @UseGuards(
    AuthGuard('jwt'),
    new RolesGuard({
      [Positions.OWNER]: [],
      [Positions.DEVELOPER]: ['uid', 'stack', 'isInternal', 'status'],
    }),
  )
  @Get()
  public async findProjects(
    @Res() res: Response,
    @Query() query: ProjectFilterDto,
    @Req() req: Request,
  ): Promise<Response> {
    try {
      const { position } = req.user as IUser<IProject[], Positions>;
      const projects: IProject[] = await this.projectService.findProjects(
        query,
        position,
      );
      return res.status(HttpStatus.OK).json({ data: projects, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }

  @ApiOperation({
    summary: 'Find projects by uid',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Found project',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Record not found',
  })
  @UseGuards(AuthGuard('jwt'))
  @Get('/:id')
  public async findById(
    @Res() res: Response,
    @Param('id') id: string,
  ): Promise<Response> {
    try {
      const project: IProject = await this.projectService.findById(id);
      return res.status(HttpStatus.OK).json({ data: project, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }

  @ApiOperation({
    summary: 'Create new project',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Success add project',
  })
  @UseGuards(AuthGuard('jwt'), new RolesGuard(Positions.OWNER))
  @Post()
  public async createProject(
    @Res() res: Response,
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Response> {
    try {
      const project: IProject = await this.projectService.createProject(
        createProjectDto,
      );
      return res.status(HttpStatus.OK).json({ data: project, error: null });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error });
    }
  }
}
