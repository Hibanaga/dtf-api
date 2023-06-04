import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreatePostInput, LikeUnlikeInput, UpdatePostInput } from 'src/graphql';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../../authentication/guard/access-token.guard';
import { Post } from '../../models/Post';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation('createPost')
  async create(@Args('input') input: CreatePostInput): Promise<Post> {
    return await this.postsService.create(input);
  }

  @Mutation('updatePost')
  async update(@Args('input') input: UpdatePostInput): Promise<Post> {
    return await this.postsService.update(input);
  }

  @Mutation('')
  async likeUnlikePost(
    @Args('input') input: LikeUnlikeInput,
  ): Promise<boolean> {
    return await this.postsService.likeUnlike(input);
  }

  @Query('posts')
  async list(): Promise<Post[]> {
    return await this.postsService.list();
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
}
