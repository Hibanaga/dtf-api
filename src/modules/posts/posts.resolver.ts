import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import {
  CreateCommentInput,
  CreatePostInput,
  Post,
  UpdatePostInput,
} from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../../authentication/guard/access-token.guard';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  // @UseGuards(GraphqlAuthGuard)
  @Mutation('createPost')
  create(@Args('input') input: CreatePostInput) {
    return this.postsService.create(input);
  }

  @Mutation('updatePost')
  update(@Args('input') input: UpdatePostInput) {
    return this.postsService.update(input);
  }

  @Query('posts')
  async list() {
    return await this.postsService.list();
  }

  @Query('post')
  single(@Args('id') id: number) {
    return this.postsService.single(id);
  }

  @UseGuards(GraphqlAuthGuard)
  @Mutation('removePost')
  remove(@Args('id') id: number) {
    return this.postsService.remove(id);
  }
}
