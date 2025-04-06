// src/appointment/dto/create-appointment.dto.ts
import { IsString, IsDateString, IsEnum } from 'class-validator';

export class CreateAppointmentDto {
  @IsString()
  patient_id: string;

  @IsString()
  branch_id: string;

  @IsString()
  appoitment_reason: string;

  @IsDateString()
  start_time: string;

  @IsDateString()
  end_time: string;

  @IsEnum(['UPCOMING', 'COMPLETED', 'CANCELLED'])
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';

  @IsString()
  notes: string;
}
