// src/appointment/appointment.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import * as moment from 'moment';

@Injectable()
export class AppointmentService {
  private readonly logger = new Logger(AppointmentService.name);

  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  /**
   * Create a new appointment
   */
  async create(createAppointmentDto: CreateAppointmentDto): Promise<any> {
    this.logger.log('Creating a new appointment');
    try {
      const appointment = new this.appointmentModel(createAppointmentDto);
      const result = await appointment.save();
      this.logger.log(`Appointment created successfully with ID: ${result._id}`);
      return {
        statusCode: 201,
        message: 'Appointment created successfully',
      };
    } catch (error) {
      this.logger.error('Error creating appointment', error.stack);
      throw new InternalServerErrorException('Failed to create appointment');
    }
  }

  /**
   * Get all appointments for the week of a given date
   */
  async findAll(date: string): Promise<any> {
    this.logger.log(`Fetching appointments for the week of date: ${date}`);
    try {
      // Validate the date
      const parsedDate = moment(date, moment.ISO_8601, true);
      if (!parsedDate.isValid()) {
        this.logger.error('Invalid date format provided');
        throw new InternalServerErrorException('Invalid date format. Use YYYY-MM-DD.');
      }

      // Get start (Sunday) and end (Saturday) of the week
      const startOfWeek = moment(parsedDate).startOf('week'); // Sunday
      const endOfWeek = moment(parsedDate).endOf('week');     // Saturday

      this.logger.log(
        `Fetching appointments from ${startOfWeek.format('YYYY-MM-DD')} to ${endOfWeek.format('YYYY-MM-DD')}`,
      );

      const appointments = await this.appointmentModel
        .find({
          start_time: {
            $gte: startOfWeek.toDate(),
            $lte: endOfWeek.toDate(),
          },
        })
        .populate('patient_id')
        .populate('branch_id')
        .exec();

      this.logger.log(`Fetched ${appointments.length} appointments`);
      return {
        statusCode: 200,
        message: `Appointments from ${startOfWeek.format('YYYY-MM-DD')} to ${endOfWeek.format('YYYY-MM-DD')}`,
        data: appointments,
      };
    } catch (error) {
      this.logger.error('Error fetching appointments', error.stack);
      throw new InternalServerErrorException('Failed to fetch appointments');
    }
  }

  /**
   * Get appointment by ID
   */
  async findOne(id: string): Promise<any> {
    this.logger.log(`Fetching appointment with ID: ${id}`);
    try {
      const appointment = await this.appointmentModel
        .findById(id)
        .populate('patient_id')
        .populate('branch_id')
        .exec();

      if (!appointment) {
        this.logger.warn(`Appointment with ID: ${id} not found`);
        throw new NotFoundException(`Appointment #${id} not found`);
      }

      this.logger.log(`Appointment with ID: ${id} fetched successfully`);
      return {
        statusCode: 200,
        message: 'Appointment fetched successfully',
        data: appointment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error fetching appointment with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to fetch appointment');
    }
  }

  /**
   * Update appointment by ID
   */
  async update(
    id: string,
    updateAppointmentDto: UpdateAppointmentDto,
  ): Promise<any> {
    this.logger.log(`Updating appointment with ID: ${id}`);
    try {
      const updated = await this.appointmentModel
        .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
        .populate('patient_id')
        .populate('branch_id')
        .exec();

      if (!updated) {
        this.logger.warn(`Appointment with ID: ${id} not found for update`);
        throw new NotFoundException(`Appointment #${id} not found`);
      }

      this.logger.log(`Appointment with ID: ${id} updated successfully`);
      return {
        statusCode: 200,
        message: 'Appointment updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error updating appointment with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to update appointment');
    }
  }

  /**
   * Delete appointment by ID
   */
  async remove(id: string): Promise<any> {
    this.logger.log(`Deleting appointment with ID: ${id}`);
    try {
      const deleted = await this.appointmentModel.findByIdAndDelete(id).exec();

      if (!deleted) {
        this.logger.warn(`Appointment with ID: ${id} not found for deletion`);
        throw new NotFoundException(`Appointment #${id} not found`);
      }

      this.logger.log(`Appointment with ID: ${id} deleted successfully`);
      return {
        statusCode: 200,
        message: 'Appointment deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`Error deleting appointment with ID: ${id}`, error.stack);
      throw new InternalServerErrorException('Failed to delete appointment');
    }
  }
}
