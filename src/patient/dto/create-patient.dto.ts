// src/patient/dto/create-patient.dto.ts
import { IsString, IsDateString, IsOptional, IsNumber } from 'class-validator';

export class CreatePatientDto {

  @IsNumber()
  custom_id: string;

  @IsString()
  name: string;

  @IsDateString()
  @IsOptional()
  dob?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  phone_no: string;

  @IsOptional()
  @IsString()
  email?: string;
}
