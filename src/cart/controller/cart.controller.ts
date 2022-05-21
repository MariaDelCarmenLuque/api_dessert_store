import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { Role } from '../../auth/roles.enum';
import { CartItemsDto } from '../models/cart-item.dto';
import { CartDto } from '../models/cart.dto';
import { CreateCartItemDto } from '../models/create-cart-item.dto';
import { CartService } from '../service/cart.service';

@ApiTags('Cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all item in Cart' })
  @ApiResponse({
    status: 200,
    description: 'Return a list of items',
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'Item is not logged in',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized get all items in a Cart',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async getAllItems(@GetUser() user: User): Promise<CartItemsDto[]> {
    return await this.cartService.getItems(user.id);
  }

  @Patch('/cart-item')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Added cart items in Cart' })
  @ApiResponse({
    status: 200,
    description: 'Return list of cart items',
  })
  @ApiUnauthorizedResponse({
    schema: {
      example: new UnauthorizedException().getResponse(),
    },
    description: 'User is not logged in',
  })
  @ApiForbiddenResponse({
    description: 'User is not authorized to create or update items in Cart',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async updateItem(
    @GetUser() user: User,
    @Body() createCartItem: CreateCartItemDto,
  ): Promise<CartDto> {
    return await this.cartService.upsertItem(user.id, createCartItem);
  }

  @Delete('/cart-item/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  async delete(@GetUser() user: User, @Param('id') id: number): Promise<void> {
    await this.cartService.delete(user.id, id);
  }
}
