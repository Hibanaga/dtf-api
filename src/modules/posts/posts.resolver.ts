import { Resolver, Query, Mutation, Args, Info } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import {
  CreatePostInput,
  LikeUnlikePostInput,
  UpdatePostInput,
} from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../../authentication/guard/access-token.guard';
import { Post } from '../../models/Post';
import { NestedObject, PaginationParams } from '../../types/Options';
import { FieldNode, GraphQLResolveInfo } from 'graphql';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Query('posts')
  async list(
    @Args('input') args,
    @Info() info: GraphQLResolveInfo,
  ): Promise<PaginationParams<Post>> {
    const requestedFields = this.getRequestedFields(info.fieldNodes[0]);
    return await this.postsService.list(args, requestedFields);
  }

  @Mutation('createPost')
  async create(@Args('input') input: CreatePostInput): Promise<Post> {
    return await this.postsService.create(input);
  }

  @Mutation('updatePost')
  async update(@Args('input') input: UpdatePostInput): Promise<Post> {
    return await this.postsService.update(input);
  }

  @Mutation('likeUnlikePost')
  async likeUnlike(
    @Args('input') input: LikeUnlikePostInput,
  ): Promise<boolean> {
    return await this.postsService.likeUnlike(input);
  }

  @Query('post')
  async single(@Args('id') id: string): Promise<Post> {
    return await this.postsService.single(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation('removePost')
  async remove(@Args('id') id: string): Promise<Post> {
    return await this.postsService.remove(id);
  }

  private getRequestedFields(selection: FieldNode): NestedObject {
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
