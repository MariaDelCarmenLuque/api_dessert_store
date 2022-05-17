import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Dessert } from '@prisma/client';
import { CreateDessertDto } from '../models/create-dessert.dto';
import { DessertDto } from '../models/dessert.dto';
import { UpdateDessertDto } from '../models/update-dessert.dto';
import { DessertsService } from '../service/desserts.service';

@Controller('desserts')
export class DessertsController {
  constructor(private dessertsService: DessertsService) {}

  @Get()
  async getAllDesserts(): Promise<Dessert[]> {
    return await this.dessertsService.getAllDesserts();
  }
  @Get('/filters')
  async getAllDessertsFilter(
    @Query('take', new DefaultValuePipe(10), ParseIntPipe) take?: 10,
    @Query('skip', new DefaultValuePipe(1), ParseIntPipe) skip?: 1,
    @Query('category', new DefaultValuePipe(null), ParseIntPipe)
    category?: number,
  ): Promise<Dessert[]> {
    const params = { take, skip, category };
    return await this.dessertsService.getPaginationList(params);
  }

  @Get('/:id')
  async findDessertById(@Param('id') id: number): Promise<Dessert> {
    const dessert = await this.dessertsService.findOne(id);
    if (!dessert) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return dessert;
  }

  @Post()
  async createDessert(
    @Body() createDessert: CreateDessertDto,
  ): Promise<DessertDto> {
    return await this.dessertsService.create(createDessert);
  }

  @Patch('/:id')
  async updateDessert(
    @Param('id') id: number,
    @Body() updateDessert: UpdateDessertDto,
  ): Promise<DessertDto> {
    return await this.dessertsService.updateDessert(id, updateDessert);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number) {
    return await this.dessertsService.deleteDessert(id);
  }

  @Patch('/:id/status')
  async enableStatus(@Param('id') id: number) {
    // const dessert: Dessert = await this.dessertsService.findOne(id);
    // if (!dessert) {
    //   throw new HttpException('Dessert Not Found', HttpStatus.NOT_FOUND);
    // }
    return await this.dessertsService.updateStatus(id);
  }
}
