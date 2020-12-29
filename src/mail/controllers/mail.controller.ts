import { CreateMailDto } from './../dto/mail.dto';
import { Controller, HttpStatus, Res, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { MailService } from '../services/mail.service';

@ApiTags('mail')
@Controller('mail')
export class MailController {
  public constructor(private readonly _mailService: MailService) {}

  @ApiOperation({
    summary: 'Send mail.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Mail sent',
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Mail not sent',
  })
  @Post('')
  public async sendMail(
    @Res() res: Response,
    @Body() mail: CreateMailDto,
  ): Promise<Response> {
    try {
      await this._mailService.sendMail(mail);
      return res.status(HttpStatus.OK).json({ data: 'Mail sent', error: null });
    } catch (e) {
      console.log(e);

      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ data: null, error: 'Something went wrong.' });
    }
  }
}
