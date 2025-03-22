// src/branch/branch.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Branch, BranchDocument } from './schema/branch.schema';
import { Model } from 'mongoose';
import { CreateBranchDto } from './dto/create-branch.dto';

@Injectable()
export class BranchService {
  constructor(
    @InjectModel(Branch.name) private branchModel: Model<BranchDocument>,
  ) {}

  async create(createBranchDto: CreateBranchDto): Promise<Branch> {
    const branch = new this.branchModel(createBranchDto);
    return branch.save();
  }

  async findAll(): Promise<Branch[]> {
    return this.branchModel.find().exec();
  }
}
