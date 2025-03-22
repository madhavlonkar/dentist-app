// src/appointment/appointment.service.ts
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentDto } from './dto/update-appointment.dto';
import { Appointment, AppointmentDocument } from './schemas/appointment.schema';
import * as moment from 'moment';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name)
    private readonly appointmentModel: Model<AppointmentDocument>,
  ) {}

  /**
   * Create a new appointment
   */
  async create(createAppointmentDto: CreateAppointmentDto): Promise<any> {
    try {
      const appointment = new this.appointmentModel(createAppointmentDto);
      const result = await appointment.save();

      return {
        statusCode: 201,
        message: 'Appointment created successfully',
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to create appointment');
    }
  }

  /**
   * Get all appointments
   */
  async findAll(date: string): Promise<any> {
    try {
      // Validate the date
      const parsedDate = moment(date, moment.ISO_8601, true);
      if (!parsedDate.isValid()) {
        throw new InternalServerErrorException('Invalid date format. Use YYYY-MM-DD.');
      }

      // Get start (Sunday) and end (Saturday) of the week
      const startOfWeek = moment(parsedDate).startOf('week'); // Sunday
      const endOfWeek = moment(parsedDate).endOf('week');     // Saturday

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

      return {
        statusCode: 200,
        message: `Appointments from ${startOfWeek.format('YYYY-MM-DD')} to ${endOfWeek.format('YYYY-MM-DD')}`,
        data: appointments,
      };
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch appointments');
    }
  }

  /**
   * Get appointment by ID
   */
  async findOne(id: string): Promise<any> {
    try {
      const appointment = await this.appointmentModel
        .findById(id)
        .populate('patient_id')
        .populate('branch_id')
        .exec();

      if (!appointment) {
        throw new NotFoundException(`Appointment #${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'Appointment fetched successfully',
        data: appointment,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
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
    try {
      const updated = await this.appointmentModel
        .findByIdAndUpdate(id, updateAppointmentDto, { new: true })
        .populate('patient_id')
        .populate('branch_id')
        .exec();

      if (!updated) {
        throw new NotFoundException(`Appointment #${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'Appointment updated successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update appointment');
    }
  }

  /**
   * Delete appointment by ID
   */
  async remove(id: string): Promise<any> {
    try {
      const deleted = await this.appointmentModel.findByIdAndDelete(id).exec();

      if (!deleted) {
        throw new NotFoundException(`Appointment #${id} not found`);
      }

      return {
        statusCode: 200,
        message: 'Appointment deleted successfully',
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to delete appointment');
    }
  }
}
