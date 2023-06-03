import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterInput } from 'src/graphql';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation('register')
  register(@Args('input') input: RegisterInput) {
    return this.usersService.register(input);
  }
}
