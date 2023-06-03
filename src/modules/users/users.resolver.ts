import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterInput, SignInInput } from 'src/graphql';

@Resolver('User')
export class UsersResolver {
  constructor(private readonly userService: UsersService) {}

  @Mutation('register')
  register(@Args('input') input: RegisterInput) {
    return this.userService.register(input);
  }

  @Mutation('signIn')
  signIn(@Args('input') input: SignInInput) {
    return this.userService.login(input);
  }
}
