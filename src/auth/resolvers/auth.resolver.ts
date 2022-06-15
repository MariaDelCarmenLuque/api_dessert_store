import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/users/dtos/input/create-user.input';
import { LoginInput } from '../dtos/input/login.input';
import { Token } from '../models/token.model';
import { AuthService } from '../service/auth.service';

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => Token, {
    description: 'Mutation: Register a new User',
    name: 'userRegister',
  })
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return await this.authService.createUser(createUserInput);
  }

  @Mutation(() => Token, {
    description: 'Mutation: Login a User',
    name: 'userLogin',
  })
  async loginUser(@Args('loginInput') loginInput: LoginInput) {
    return await this.authService.login(loginInput);
  }
}
