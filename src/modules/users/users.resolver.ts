import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterInput } from 'src/graphql';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('registerUser')
  register(@Args('registerUserInput') registerUserInput: RegisterInput) {
    return this.usersService.register(registerUserInput);
  }
}
