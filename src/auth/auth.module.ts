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

@Module({
  controllers,
  exports: [AuthService],
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
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
