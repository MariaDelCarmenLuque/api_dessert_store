import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { Public } from '../../auth/decorators/public.decorator';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { Role } from '../../auth/roles.enum';
import { CartItemsDto } from '../models/cart-item.dto';
import { CartDto } from '../models/cart.dto';
import { CreateCartItemDto } from '../models/create-cart-item.dto';
import { CartService } from '../service/cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  async getAllItems(@GetUser() user: User): Promise<CartItemsDto[]> {
    return await this.cartService.getItems(user.id);
  }

  @Patch('/cart-item')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  async updateItem(
    @GetUser() user: User,
    @Body() createCartItem: CreateCartItemDto,
  ): Promise<CartDto> {
    return await this.cartService.updateItem(user.id, createCartItem);
  }

  @Delete('/cart-item/:id')
  @Roles(Role.ADMIN)
  @UseGuards(JwtAuthGuard)
  async delete(@GetUser() user: User, @Param('id') id: number): Promise<void> {
    await this.cartService.delete(user.id, id);
  }
}
