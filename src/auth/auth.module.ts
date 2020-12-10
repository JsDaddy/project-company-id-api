import { SlackModule } from './../shared/slack.module';
import { projectSchema } from './../project/schemas/project.schema';
import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './services/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { services } from './services';
import { controllers } from './controllers';
import { userSchema } from './schemas/user.schema';
import { vacationSchema } from 'src/vacations/schemas/vacation.schema';
import { UserService } from './services/user.service';

@Module({
  controllers,
  exports: [AuthService, UserService],
  imports: [
    SlackModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'vacations', schema: vacationSchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
    MongooseModule.forFeature([{ name: 'projects', schema: projectSchema }]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async () => ({
        secret: process.env.SECRET,
      }),
    }),
  ],
  providers: [...services, JwtStrategy],
})
export class AuthModule {}
