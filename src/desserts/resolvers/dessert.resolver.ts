import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DessertInput } from '../dtos/input/create-dessert.input';
import { Dessert } from '../models/dessert.model';
import { DessertsService } from '../service/desserts.service';

@Resolver(() => Dessert)
export class DessertsResolver {
  constructor(private dessertService: DessertsService) {}

  @Query(() => Dessert, { description: 'Query: Return a dessert by ID' })
  async productGetOne(@Args('id') id: number) {
    return await this.dessertService.findOne(id);
  }

  @Mutation(() => Dessert, { description: 'Mutation: Create a Dessert' })
  async createDessert(@Args('dessertInput') dessertInput: DessertInput) {
    return await this.dessertService.create(dessertInput);
  }
}
