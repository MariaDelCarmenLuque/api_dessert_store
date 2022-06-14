import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UpdateUserInput } from '../dtos/input/update-user.input';
import { User } from '../models/user.model';
import { UsersService } from '../service/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, {
    description: 'Query: Return a User by Id',
    name: 'UserGetOne',
  })
  async getOneUser(@Args('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Query(() => [User], {
    description: 'Query: Return all users',
    name: 'UserGetAll',
  })
  async getAllUser() {
    return await this.usersService.getAll();
  }

  @Mutation(() => User, {
    description: 'Mutation: Update a User',
    name: 'UserUpdate',
  })
  async updateUser(
    @Args('id') id: number,
    @Args('updateDessertInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => User, {
    description: 'Mutation: Delete a User',
    name: 'UserDelete',
  })
  async deleteUser(@Args('id') id: number) {
    return await this.usersService.delete(id);
  }
}
