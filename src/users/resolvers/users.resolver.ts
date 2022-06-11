import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserInput } from '../dtos/input/update-user.input';
import { User } from '../models/user.model';
import { UsersService } from '../service/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, { description: 'Return a User by Id' })
  async userGetOne(@Args('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Query(() => [User], { description: 'Query: Return all users' })
  async userGetAll() {
    return await this.usersService.getAll();
  }

  @Mutation(() => User, { description: 'Mutation: Update a User' })
  async updateUser(
    @Args('id') id: number,
    @Args('updateDessertInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.usersService.updateUser(id, updateUserInput);
  }
}
