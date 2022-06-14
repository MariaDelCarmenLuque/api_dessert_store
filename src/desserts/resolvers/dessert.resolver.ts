import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlGetUser } from 'src/auth/decorators/gql-user.decorator';
import { CreateLikeInput } from 'src/likes/dtos/input/create-like.input';
import { Like } from 'src/likes/models/like.model';
import { LikesService } from 'src/likes/service/likes.service';
import { CreateDessertInput } from '../dtos/input/create-dessert.input';
import { ImageInput } from '../dtos/input/create-image.input';
import { UpdateDessertInput } from '../dtos/input/update-dessert.input';
import { Dessert } from '../models/dessert.model';
import { DessertsService } from '../service/desserts.service';

@Resolver(() => Dessert)
export class DessertsResolver {
  constructor(
    private readonly dessertService: DessertsService,
    private readonly likesService: LikesService,
  ) {}

  @Query(() => Dessert, {
    description: 'Query: Return a dessert by ID',
    name: 'DessertGetOne',
  })
  async getOneDessert(@Args('id') id: number) {
    return await this.dessertService.findOne(id);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Create a Dessert',
    name: 'DessertCreate',
  })
  async createDessert(@Args('dessertInput') dessertInput: CreateDessertInput) {
    return await this.dessertService.create(dessertInput);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Update a Dessert',
    name: 'DessertUpdate',
  })
  async updateDessert(
    @Args('id') id: number,
    @Args('updateDessertInput') updateDessertInput: UpdateDessertInput,
  ) {
    return await this.dessertService.updateDessert(id, updateDessertInput);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Update status Dessert',
    name: 'DessertUpdateStatus',
  })
  async updateStatusDessert(@Args('id') id: number) {
    return await this.dessertService.updateStatus(id);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Create a Image',
    name: 'ImageCreate',
  })
  async createImage(
    @Args('id') id: number,
    @Args('imageInput') imageInput: ImageInput,
  ) {
    return await this.dessertService.createImage(id, imageInput);
  }

  @Mutation(() => Dessert, {
    description: 'Mutation: Delete a Dessert',
    name: 'DessertDelete',
  })
  async deleteDessert(@Args('id') id: number) {
    return await this.dessertService.deleteDessert(id);
  }

  @Mutation(() => Like, {
    description: 'Mutation: Create or update a like in a dessert',
    name: 'LikeCreate',
  })
  async createLike(
    @GqlGetUser() user,
    @Args('id') id: number,
    @Args('likeInput') likeInput: CreateLikeInput,
  ) {
    return await this.likesService.upsertLike(user.id, id, likeInput);
  }

  @Mutation(() => Like, {
    description: 'Mutation: Delete a like in a dessert',
    name: 'LikeDelete',
  })
  async deleteLike(@GqlGetUser() user, @Args('id') id: number) {
    return await this.likesService.delete(user.id, id);
  }
}
