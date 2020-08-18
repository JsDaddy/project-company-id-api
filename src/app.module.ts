import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HolidayModule } from './holiday/holiday.module';
import { TechnologyModule } from './technology/technology.module';
import { RuleModule } from './rule/rule.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get('DATABASE'),
      }),
    }),
    AuthModule,
    HolidayModule,
    LogModule,
    TechnologyModule,
    RuleModule,
    ProjectModule,
  ],
  providers: [AppService],
})
export class AppModule {}
