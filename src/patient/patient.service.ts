// src/patient/patient.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient, PatientDocument } from './schemas/patient.schema';

@Injectable()
export class PatientService {
  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
  ) { }

  /**
   * Create a new patient
   */
  async create(createPatientDto: CreatePatientDto): Promise<any> {
    try {
      const patient = new this.patientModel(createPatientDto);
      const result = await patient.save();

      return {
        statusCode: 201,
        message: 'Patient added successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to add patient in the system',
      );
    }
  }

  /**
   * Get all patients
   */
  async findAll(search?: string): Promise<any> {
    try {
      // Build dynamic search filter
      const filter = search
        ? {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { email: { $regex: search, $options: 'i' } },
            { phone_no: { $regex: search, $options: 'i' } },
          ],
        }
        : {};

      const patients = await this.patientModel.find(filter).exec();

      return {
        statusCode: 200,
        message: 'Patients fetched successfully',
        data: patients,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch patients');
    }
  }


  /**
   * Get a single patient by ID
   */
  async findOne(id: string): Promise<any> {
    try {
      const patient = await this.patientModel.findById(id).exec();

      if (!patient) {
        throw new NotFoundException(`Patient #${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'Patient fetched successfully',
        data: patient,
      };
    } catch (error) {
      // Forward known NotFoundException
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to fetch patient');
    }
  }

  /**
   * Update a patient by ID
   */
  async update(
    id: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<any> {
    try {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, { new: true })
        .exec();

      if (!updatedPatient) {
        throw new NotFoundException(`Patient #${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'Patient updated successfully',
      };
    } catch (error) {
      // Forward known NotFoundException
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update patient');
    }
  }

}
