import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TechnologyModule } from './technology/technology.module';
import { RuleModule } from './rule/rule.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { VacationsModule } from './vacations/vacations.module';
import { TimelogsModule } from './timelogs/timelogs.module';

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
    VacationsModule,
    TimelogsModule,
    LogModule,
    TechnologyModule,
    RuleModule,
    ProjectModule,
  ],
  providers: [AppService],
})
export class AppModule {}
