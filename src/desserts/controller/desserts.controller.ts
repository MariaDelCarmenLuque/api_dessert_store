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
  UseGuards,
} from '@nestjs/common';
import { Dessert } from '@prisma/client';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from 'src/auth/roles.enum';
import { CreateDessertDto } from '../models/create-dessert.dto';
import { DessertDto } from '../models/dessert.dto';
import { UpdateDessertDto } from '../models/update-dessert.dto';
import { DessertsService } from '../service/desserts.service';

@Controller('desserts')
export class DessertsController {
  constructor(private dessertsService: DessertsService) {}

  @Get()
  // @Public()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async getAllDesserts(): Promise<Dessert[]> {
    return await this.dessertsService.getAllDesserts();
  }
  @Get('/filters')
  @Public()
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
  @Public()
  async findDessertById(@Param('id') id: number): Promise<Dessert> {
    const dessert = await this.dessertsService.findOne(id);
    if (!dessert) {
      throw new HttpException('User Not Found', HttpStatus.NOT_FOUND);
    }
    return dessert;
  }

  @Post()
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async createDessert(
    @Body() createDessert: CreateDessertDto,
  ): Promise<DessertDto> {
    return await this.dessertsService.create(createDessert);
  }

  @Patch('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async updateDessert(
    @Param('id') id: number,
    @Body() updateDessert: UpdateDessertDto,
  ): Promise<DessertDto> {
    return await this.dessertsService.updateDessert(id, updateDessert);
  }

  @Delete('/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async delete(@Param('id') id: number) {
    return await this.dessertsService.deleteDessert(id);
  }

  @Patch('/:id/status')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard, RolesGuard)
  async enableStatus(@Param('id') id: number) {
    return await this.dessertsService.updateStatus(id);
  }
}
