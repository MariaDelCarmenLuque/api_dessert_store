import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  NotFoundException,
  Param,
  Patch,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { UserDto } from 'src/users/dtos/response/user.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { GetUser } from '../../auth/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt-guard';
import { Role } from '../../auth/roles.enum';
import { CartItemsDto } from '../dtos/response/cart-item.dto';
import { CartDto } from '../dtos/response/cart.dto';
import { CreateCartItemDto } from '../dtos/request/create-cart-item.dto';
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
    description: 'User is not authorized get all items in a Cart',
    schema: {
      example: new ForbiddenException().getResponse(),
    },
  })
  async getAllItems(@GetUser() user: UserDto): Promise<CartItemsDto[]> {
    return await this.cartService.getItems(user.id);
  }

  @Patch('/cart-item')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Added cart items in Cart' })
  @ApiNotFoundResponse({
    description: 'Dessert Not Found',
    schema: {
      example: new NotFoundException('No Dessert found').getResponse(),
    },
  })
  @ApiConflictResponse({
    description: 'Status dessert is DISABLE',
    schema: {
      example: new ConflictException(
        'This dessert has been disable',
      ).getResponse(),
    },
  })
  @ApiBadRequestResponse({
    description: 'Quantity required doesnt available',
    schema: {
      example: new BadRequestException(
        'Required quantit not available',
      ).getResponse(),
    },
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
    @GetUser() user: UserDto,
    @Body() createCartItem: CreateCartItemDto,
  ): Promise<CartDto> {
    return await this.cartService.upsertItem(user.id, createCartItem);
  }

  @Delete('/cart-item/:id')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Item delete successfully' })
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
  async delete(
    @GetUser() user: UserDto,
    @Param('id') id: number,
  ): Promise<void> {
    await this.cartService.delete(user.id, id);
  }

  @Patch('/purchase')
  @Roles(Role.USER)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Purchase a cart' })
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
  async purchasedCart(@GetUser() user: UserDto): Promise<void> {
    await this.cartService.purchaseCart(user.id);
  }
}
