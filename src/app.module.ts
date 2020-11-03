import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { StackModule } from './stack/stack.module';
import { RuleModule } from './rule/rule.module';
import { ProjectModule } from './project/project.module';
import { AuthModule } from './auth/auth.module';
import { LogModule } from './log/log.module';
import { VacationsModule } from './vacations/vacations.module';
import { TimelogsModule } from './timelogs/timelogs.module';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useFactory: async () => {
        return {
          uri: `${process.env.DATABASE_PATH}/${process.env.DATABASE_NAME}`,
        };
      },
    }),
    AuthModule,
    VacationsModule,
    TimelogsModule,
    LogModule,
    StackModule,
    RuleModule,
    ProjectModule,
  ],
  providers: [AppService],
})
export class AppModule {}
