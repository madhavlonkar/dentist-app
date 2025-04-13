// src/patient/patient.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
  BadRequestException,
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
  ) { }

  /**
   * Create a new patient
   */
  async create(createPatientDto: CreatePatientDto): Promise<any> {
    this.logger.log('Creating a new patient');
    try {
      // Check if custom_id is present and already exists
      if (createPatientDto.custom_id) {
        const existingPatient = await this.patientModel.findOne({ custom_id: createPatientDto.custom_id });
        if (existingPatient) {
          this.logger.warn(`Patient with custom_id ${createPatientDto.custom_id} already exists`);
          throw new BadRequestException(`Patient with custom_id ${createPatientDto.custom_id} already exists`);
        }
      }

      const patient = new this.patientModel(createPatientDto);
      const result = await patient.save();

      this.logger.log(`Patient created successfully with ID: ${result._id}`);
      return {
        message: 'Patient added successfully',
      };
    } catch (error) {
      this.logger.error('Error creating patient', error.stack);
      if (error instanceof BadRequestException) {
        throw error;
      }
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
  async findOne(customId: string): Promise<any> {
    this.logger.log(`Fetching patient with custom_id: ${customId}`);
    try {
      const patient = await this.patientModel.findOne({ custom_id: customId }).exec();

      if (!patient) {
        this.logger.warn(`Patient with custom_id: ${customId} not found`);
        throw new NotFoundException(`Patient with custom_id ${customId} not found`);
      }

      this.logger.log(`Patient with custom_id: ${customId} fetched successfully`);
      return {
        statusCode: 200,
        message: 'Patient fetched successfully',
        data: patient,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching patient with custom_id: ${customId}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch patient');
    }
  }


  /**
   * Update a patient by ID
   */
  async update(
    customId: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<any> {
    this.logger.log(`Updating patient with custom_id: ${customId}`);
    try {
      const updatedPatient = await this.patientModel
        .findOneAndUpdate({ custom_id: customId }, updatePatientDto, { new: true })
        .exec();

      if (!updatedPatient) {
        this.logger.warn(`Patient with custom_id: ${customId} not found for update`);
        throw new NotFoundException(`Patient with custom_id ${customId} not found`);
      }

      this.logger.log(`Patient with custom_id: ${customId} updated successfully`);
      return {
        statusCode: 200,
        message: 'Patient updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating patient with custom_id: ${customId}`, error.stack);
      throw new InternalServerErrorException('Failed to update patient');
    }
  }

}
