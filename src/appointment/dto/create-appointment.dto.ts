// src/appointment/dto/create-appointment.dto.ts
import { IsString, IsDateString, IsOptional } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patientId: string;

  @IsDateString()
  date: Date;

  @IsString()
  time: string;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
