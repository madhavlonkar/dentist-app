// src/appointment/appointment.controller.ts
import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
  } from '@nestjs/common';
  import { AppointmentService } from './appointment.service';
  import { CreateAppointmentDto } from './dto/create-appointment.dto';
  import { UpdateAppointmentDto } from './dto/update-appointment.dto';
  
  @Controller('appointments')
  export class AppointmentController {
    constructor(private readonly appointmentService: AppointmentService) {}
  
    @Post()
    create(@Body() createAppointmentDto: CreateAppointmentDto) {
      return this.appointmentService.create(createAppointmentDto);
    }
  
    @Get()
    findAll(@Query('date') date: string) {
      return this.appointmentService.findAll(date);
    }
  
    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.appointmentService.findOne(id);
    }
  
    @Patch(':id')
    update(
      @Param('id') id: string,
      @Body() updateAppointmentDto: UpdateAppointmentDto,
    ) {
      return this.appointmentService.update(id, updateAppointmentDto);
    }
  
    @Delete(':id')
    remove(@Param('id') id: string) {
      return this.appointmentService.remove(id);
    }
  }
  