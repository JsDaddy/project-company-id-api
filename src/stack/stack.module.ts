import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StackController } from './controllers/stack.controller';
import { StackService } from './services/stack.service';
import { stackSchema } from './schemas/stack.schema';

@Module({
  controllers: [StackController],
  exports: [StackService],
  imports: [
    MongooseModule.forFeature([{ name: 'stacks', schema: stackSchema }]),
  ],
  providers: [StackService],
})
export class StackModule {}
