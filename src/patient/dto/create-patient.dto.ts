// src/patient/dto/create-patient.dto.ts
import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  name: string;

  @IsDateString()
  dob: string;

  @IsString()
  address?: string;

  @IsString()
  phone_no: string;

  @IsOptional()
  @IsString()
  email?: string;
}
