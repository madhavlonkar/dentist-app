// src/patient/schemas/patient.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type PatientDocument = Patient & Document;

@Schema({ timestamps: true })
export class Patient {
  @Prop({ required: true, unique: true })
  custom_id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  dob: Date;

  @Prop()
  address: string;

  @Prop({ required: true, unique: true })
  phone_no: string; // Phone number - must be unique

  @Prop()
  email?: string;
}

export const PatientSchema = SchemaFactory.createForClass(Patient);
