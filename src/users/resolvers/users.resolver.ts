import { Args, Query, Resolver } from '@nestjs/graphql';
import { User } from '../models/user.model';
import { UsersService } from '../service/users.service';

@Resolver(() => User)
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @Query(() => User)
  async userGetOne(@Args('id') id: number) {
    return await this.usersService.findOne(id);
  }
}
