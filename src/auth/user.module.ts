import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { userSchema } from './dto/user.schema';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';

@Module({
  controllers: [UserController],
  exports: [UserService],
  imports: [MongooseModule.forFeature([{ name: 'user', schema: userSchema }])],
  providers: [UserService],
})
export class UserModule {}
