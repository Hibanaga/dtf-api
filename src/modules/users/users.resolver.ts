import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { RegisterInput, SignInInput } from 'src/graphql';
import { FieldNode, GraphQLResolveInfo } from 'graphql';

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

  @Query('user')
  async single(@Args('id') id: string, @Info() info: GraphQLResolveInfo) {
    const requestedFields = this.getRequestedFields(info.fieldNodes[0]);

    return this.userService.single(id, requestedFields);
  }

  private getRequestedFields(selection: FieldNode): {
    [key: string]: any;
  } {
    if (selection.selectionSet) {
      return selection.selectionSet.selections.reduce(
        (fields: any, subSelection: any) => {
          if (subSelection.name && subSelection.name.value) {
            if (subSelection.selectionSet) {
              fields[subSelection.name.value] =
                this.getRequestedFields(subSelection);
            } else {
              fields[subSelection.name.value] = true;
            }
          }
          return fields;
        },
        {},
      );
    }
    return {};
  }
}
