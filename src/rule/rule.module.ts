import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleController } from './rule.controller';
import { RuleService } from './rule.service';
import { ruleSchema } from './rule.schema';

@Module({
  controllers: [RuleController],
  exports: [RuleService],
  imports: [MongooseModule.forFeature([{ name: 'Rule', schema: ruleSchema }])],
  providers: [RuleService],
})
export class RuleModule {}
