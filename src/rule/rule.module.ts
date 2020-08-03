import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RuleController } from './controllers/rule.controller';
import { RuleService } from './services/rule.service';
import { ruleSchema } from './schemas/rule.schema';

@Module({
  controllers: [RuleController],
  exports: [RuleService],
  imports: [MongooseModule.forFeature([{ name: 'rule', schema: ruleSchema }])],
  providers: [RuleService],
})
export class RuleModule {}
