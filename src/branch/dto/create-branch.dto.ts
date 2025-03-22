// src/branch/dto/create-branch.dto.ts
import { IsString } from 'class-validator';

export class CreateBranchDto {
  @IsString()
  name: string;

  @IsString()
  address: string;

  @IsString()
  phone_no: string;
}
