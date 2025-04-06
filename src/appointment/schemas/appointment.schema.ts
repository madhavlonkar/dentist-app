// src/appointment/schemas/appointment.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AppointmentDocument = Appointment & Document;

@Schema({ timestamps: true })
export class Appointment {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Patient', required: true })
  patient_id: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Branch', required: true })
  branch_id: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  start_time: Date;

  @Prop({ required: true })
  appoitment_reason: string;

  @Prop({ required: true })
  end_time: Date;

  @Prop({ enum: ['UPCOMING', 'COMPLETED', 'CANCELLED'], default: 'UPCOMING' })
  status: string;

  @Prop()
  notes: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);
