import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StackController } from './controllers/stack.controller';
import { StackService } from './services/stack.service';
import { stackSchema } from './schemas/stack.schema';
import { userSchema } from 'src/auth/schemas/user.schema';

@Module({
  controllers: [StackController],
  exports: [StackService],
  imports: [
    MongooseModule.forFeature([{ name: 'stacks', schema: stackSchema }]),
    MongooseModule.forFeature([{ name: 'users', schema: userSchema }]),
  ],
  providers: [StackService],
})
export class StackModule {}
