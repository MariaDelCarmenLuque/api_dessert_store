import {
  Controller,
  ForbiddenException,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { Role } from 'src/auth/roles.enum';
import { OrderDto } from '../models/order.dto';
import { OrdersService } from '../service/orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all orders of a User' })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to delete this dessert',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async getOrders(@GetUser() user: User): Promise<OrderDto[]> {
    return await this.ordersService.getMany(user.id);
  }

  @Post()
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a order' })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to delete this dessert',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async createOrder(@GetUser() user: User): Promise<OrderDto> {
    return await this.ordersService.create(user.id);
  }
}
