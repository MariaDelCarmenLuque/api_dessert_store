import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt.guard';
import { GqlRolesGuard } from 'src/auth/guards/gql-roles.guard';
import { Role } from 'src/auth/roles.enum';
import { Category } from 'src/categories/models/category.model';
import { CategoriesService } from 'src/categories/service/categories.service';
import { CreateLikeInput } from 'src/likes/dtos/input/create-like.input';
import { Like } from 'src/likes/models/like.model';
import { LikesService } from 'src/likes/service/likes.service';
import { CreateDessertInput } from '../dtos/input/create-dessert.input';
import { ImageInput } from '../dtos/input/create-image.input';
import { PaginationOptionsDessertInput } from '../dtos/input/pagination-dessert.input';
import { UpdateDessertInput } from '../dtos/input/update-dessert.input';
import { Dessert } from '../models/dessert.model';
import { Image } from '../models/image.model';
import { PaginatedDessert } from '../models/paginated-dessert-model';
import { DessertsService } from '../service/desserts.service';

@Resolver(() => Dessert)
export class DessertsResolver {
  constructor(
    private readonly dessertService: DessertsService,
    private readonly likesService: LikesService,
    private readonly categoryService: CategoriesService,
  ) {}

  @Query(() => Dessert, {
    description: 'Query: Return a dessert by ID',
    name: 'dessertGetOne',
  })
  async getOneDessert(@Args('id') id: number): Promise<Dessert> {
    return await this.dessertService.findOne(id);
  }

  @Query(() => PaginatedDessert, {
    description: 'Query: Return all Dessertss',
    name: 'dessertGetAll',
  })
  async getAllDessert(
    @Args('paginationOptions')
    paginationOptions: PaginationOptionsDessertInput,
  ) {
    const { desserts, pagination } = await this.dessertService.getAllDesserts(
      paginationOptions,
    );
    // console.log(paginationOptions);
    const data = desserts.map((dessert) => {
      return {
        node: {
          ...dessert,
        },
      };
    });

    return {
      edges: data,
      pageInfo: pagination,
    };
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Create a Dessert',
    name: 'dessertCreate',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async createDessert(
    @Args('dessertInput') dessertInput: CreateDessertInput,
  ): Promise<Dessert> {
    return await this.dessertService.create(dessertInput);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Update a Dessert',
    name: 'dessertUpdate',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async updateDessert(
    @Args('id') id: number,
    @Args('updateDessertInput') updateDessertInput: UpdateDessertInput,
  ): Promise<Dessert> {
    return await this.dessertService.updateDessert(id, updateDessertInput);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Update status Dessert',
    name: 'dessertUpdateStatus',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async updateStatusDessert(@Args('id') id: number): Promise<Dessert> {
    return await this.dessertService.updateStatus(id);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Create a Image',
    name: 'imageCreate',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async createImage(
    @Args('id') id: number,
    @Args('imageInput') imageInput: ImageInput,
  ) {
    return await this.dessertService.createImage(id, imageInput);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Delete a Dessert',
    name: 'dessertDelete',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async deleteDessert(@Args('id') id: number) {
    return await this.dessertService.deleteDessert(id);
  }

  @Mutation(() => Like, {
    description: 'Mutation: Create or update a like in a dessert',
    name: 'likeCreate',
  })
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async createLike(
    @GqlGetUser() user,
    @Args('id') id: number,
    @Args('likeInput') likeInput: CreateLikeInput,
  ): Promise<Like> {
    return await this.likesService.upsertLike(user.id, id, likeInput);
  }

  @Mutation(() => Like, {
    description: 'Mutation: Delete a like in a dessert',
    name: 'likeDelete',
  })
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async deleteLike(@GqlGetUser() user, @Args('id') id: number) {
    return await this.likesService.delete(user.id, id);
  }

  @ResolveField('category', () => Category)
  async category(@Parent() dessert: Dessert): Promise<Category> {
    return this.categoryService.getCategoryByDessert(dessert.id);
  }

  @ResolveField('images', () => [Image])
  async images(@Parent() dessert: Dessert): Promise<Image[]> {
    return this.dessertService.getImagesByDessertId(dessert.id);
  }
}
