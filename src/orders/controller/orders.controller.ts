import {
  Controller,
  ForbiddenException,
  Get,
  NotFoundException,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { Role } from 'src/auth/roles.enum';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { OrderDto } from '../dtos/order.dto';
import { OrdersService } from '../service/orders.service';

@ApiTags('Orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

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
  async getOrders(@GetUser() user: UserDto): Promise<OrderDto[]> {
    return await this.ordersService.getMany(user.id);
  }

  @Post()
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create a order' })
  @ApiNotFoundResponse({
    description: 'Cart Not Found',
    schema: {
      example: new NotFoundException('No Cart found').getResponse(),
    },
  })
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
  async createOrder(@GetUser() user: UserDto): Promise<OrderDto> {
    return await this.ordersService.create(user.id);
  }
}
