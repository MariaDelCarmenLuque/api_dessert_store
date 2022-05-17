import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { User } from '@prisma/client';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { CartItemsDto } from '../models/cart-item.dto';
import { CartDto } from '../models/cart.dto';
import { CreateCartItemDto } from '../models/create-cart-item.dto';
import { CartService } from '../service/cart.service';

@Controller('cart')
// @UseGuards(JwtAuthGuard)
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get('')
  async getAllItems(@GetUser() user: User): Promise<CartItemsDto[]> {
    const userId = 1;
    return await this.cartService.getItems(userId);
  }

  @Patch('/cart-item')
  async updateItem(
    @GetUser() user: User,
    @Body() createCartItem: CreateCartItemDto,
  ): Promise<CartDto> {
    // const uuid = 'c339beff-3284-469d-8b56-a2ac23a32ddc';
    const userId = 1;
    return await this.cartService.updateItem(userId, createCartItem);
  }

  @Delete('/:dessertId')
  async delete(
    @GetUser() user: User,
    @Param('dessertId') id: number,
  ): Promise<void> {
    const userId = 1;
    await this.cartService.delete(userId, id);
  }
}
