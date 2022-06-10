import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateDessertInput } from '../dtos/input/create-dessert.input';
import { UpdateDessertInput } from '../dtos/input/update-dessert.input';
import { Dessert } from '../models/dessert.model';
import { DessertsService } from '../service/desserts.service';

@Resolver(() => Dessert)
export class DessertsResolver {
  constructor(private dessertService: DessertsService) {}

  @Query(() => Dessert, { description: 'Query: Return a dessert by ID' })
  async dessertGetOne(@Args('id') id: number) {
    return await this.dessertService.findOne(id);
  }

  @Mutation(() => Dessert, { description: 'Mutation: Create a Dessert' })
  async createDessert(@Args('dessertInput') dessertInput: CreateDessertInput) {
    return await this.dessertService.create(dessertInput);
  }

  @Mutation(() => Dessert, { description: 'Mutation: Update a Dessert' })
  async updateDessert(
    @Args('id') id: number,
    @Args('updateDessertInput') updateDessertInput: UpdateDessertInput,
  ) {
    return await this.dessertService.updateDessert(id, updateDessertInput);
  }

  @Mutation(() => Dessert, { description: 'Update status Dessert' })
  async updateStatusDessert(@Args('id') id: number) {
    return await this.dessertService.updateStatus(id);
  }
}
