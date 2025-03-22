// src/app.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { PatientModule } from './patient/patient.module';
import { AppointmentModule } from './appointment/appointment.module';
import { BranchModule } from './branch/branch.module'; 

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGO_URI || ''),
    PatientModule,
    AppointmentModule,
    BranchModule, // ✅ included here
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
