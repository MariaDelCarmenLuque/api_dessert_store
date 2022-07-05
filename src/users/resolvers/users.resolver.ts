import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { GqlJwtGuard } from 'src/auth/guards/gql-jwt.guard';
import { GqlRolesGuard } from 'src/auth/guards/gql-roles.guard';
import { Role } from 'src/auth/roles.enum';
import { PaginationOptionsUserInput } from '../dtos/input/pagination-options-user.input';
import { UpdateUserInput } from '../dtos/input/update-user.input';
import { PaginatedUser } from '../models/paginated-user.model';
import { User } from '../models/user.model';
import { UsersService } from '../service/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => User, {
    description: 'Query: Return a User by Id',
    name: 'userGetOne',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async getOneUser(@Args('id') id: number) {
    return await this.usersService.findOne(id);
  }

  @Query(() => PaginatedUser, {
    description: 'Query: Return a list of users',
    name: 'userGetAll',
  })
  @Roles(Role.ADMIN)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async getAllUser(
    @Args('paginationOptions') paginationOptions: PaginationOptionsUserInput,
  ) {
    const { users, pagination } = await this.usersService.getAll(
      paginationOptions,
    );
    const data = users.map((user) => ({
      node: {
        ...user,
      },
    }));

    return {
      edges: data,
      pageInfo: pagination,
    };
  }

  @Mutation(() => User, {
    description: 'Mutation: Update a User',
    name: 'userUpdate',
  })
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async updateUser(
    @Args('id') id: number,
    @Args('updateDessertInput') updateUserInput: UpdateUserInput,
  ) {
    return await this.usersService.updateUser(id, updateUserInput);
  }

  @Mutation(() => User, {
    description: 'Mutation: Delete a User',
    name: 'userDelete',
  })
  @Roles(Role.ADMIN, Role.USER)
  @UseGuards(GqlJwtGuard, GqlRolesGuard)
  async deleteUser(@Args('id') id: number) {
    return await this.usersService.delete(id);
  }
}
