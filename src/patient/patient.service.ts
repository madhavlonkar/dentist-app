// src/patient/patient.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePatientDto } from './dto/create-patient.dto';
import { UpdatePatientDto } from './dto/update-patient.dto';
import { Patient, PatientDocument } from './schemas/patient.schema';

@Injectable()
export class PatientService {
  private readonly logger = new Logger(PatientService.name);

  constructor(
    @InjectModel(Patient.name)
    private readonly patientModel: Model<PatientDocument>,
  ) {}

  /**
   * Create a new patient
   */
  async create(createPatientDto: CreatePatientDto): Promise<any> {
    this.logger.log('Creating a new patient');
    try {
      const patient = new this.patientModel(createPatientDto);
      const result = await patient.save();
      this.logger.log(`Patient created successfully with ID: ${result._id}`);
      return {
        statusCode: 201,
        message: 'Patient added successfully',
      };
    } catch (error) {
      this.logger.error('Error creating patient', error.stack);
      throw new InternalServerErrorException('Failed to add patient in the system');
    }
  }

  /**
   * Get all patients
   */
  async findAll(search?: string): Promise<any> {
    this.logger.log(`Fetching patients${search ? ` with search criteria: ${search}` : ''}`);
    try {
      // Build dynamic search filter
      const filter = search
        ? {
            $or: [
              { name: { $regex: search, $options: 'i' } },
              { phone_no: { $regex: search, $options: 'i' } },
              { custom_id: { $regex: search, $options: 'i' } },
            ],
          }
        : {};

      const patients = await this.patientModel.find(filter).exec();
      this.logger.log(`Fetched ${patients.length} patients`);
      return {
        statusCode: 200,
        message: 'Patients fetched successfully',
        data: patients,
      };
    } catch (error) {
      this.logger.error('Error fetching patients', error.stack);
      throw new InternalServerErrorException('Failed to fetch patients');
    }
  }

  /**
   * Get a single patient by ID
   */
  async findOne(id: string): Promise<any> {
    this.logger.log(`Fetching patient with ID: ${id}`);
    try {
      const patient = await this.patientModel.findById(id).exec();

      if (!patient) {
        this.logger.warn(`Patient with ID: ${id} not found`);
        throw new NotFoundException(`Patient #${id} not found`);
      }

      this.logger.log(`Patient with ID: ${id} fetched successfully`);
      return {
        statusCode: 200,
        message: 'Patient fetched successfully',
        data: patient,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching patient with ID: ${id}`, error.stack);
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
    this.logger.log(`Updating patient with ID: ${id}`);
    try {
      const updatedPatient = await this.patientModel
        .findByIdAndUpdate(id, updatePatientDto, { new: true })
        .exec();

      if (!updatedPatient) {
        this.logger.warn(`Patient with ID: ${id} not found for update`);
        throw new NotFoundException(`Patient #${id} not found`);
      }

      this.logger.log(`Patient with ID: ${id} updated successfully`);
      return {
        statusCode: 200,
        message: 'Patient updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating patient with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update patient');
    }
  }
}
