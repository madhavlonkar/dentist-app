// src/branch/branch.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BranchService } from './branch.service';
import { BranchController } from './branch.controller';
import { Branch, BranchSchema } from './schema/branch.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Branch.name, schema: BranchSchema }])],
  controllers: [BranchController],
  providers: [BranchService],
})
export class BranchModule {}
