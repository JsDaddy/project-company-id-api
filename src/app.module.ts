import { RuleModule } from './rule/rule.module';
import { TechnologyModule } from './technology/technology.module';
import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { VacationModule } from './vacation/vacation.module';
import { HolidayModule } from './holiday/holiday.module';
import { TimelogModule } from './timelog/timelog.module';
import { ProjectModule } from './project/project.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('mongodb://mongodb:27017/company-id-mongodb'),
      }),
    }),
    UserModule,
    VacationModule,
    HolidayModule,
    TimelogModule,
    TechnologyModule,
    RuleModule,
    ProjectModule,
  ],
  providers: [AppService],
})
export class AppModule {}
