import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PostsService } from './posts.service';
import { CreateCommentInput, CreatePostInput, Post } from 'src/graphql';

@Resolver('Post')
export class PostsResolver {
  constructor(private readonly postsService: PostsService) {}

  @Mutation('createPost')
  create(@Args('createPostInput') createPostInput: CreatePostInput) {
    return this.postsService.create(createPostInput);
  }

  @Mutation('createComment')
  createComment(
    @Args('createCommentInput') createCommentInput: CreateCommentInput,
  ) {
    return this.postsService.createComment(createCommentInput);
  }

  @Query('posts')
  list(): Post[] {
    return this.postsService.list();
  }

  @Query('post')
  single(@Args('id') id: number) {
    return this.postsService.single(id);
  }

  @Mutation('removePost')
  remove(@Args('id') id: number) {
    return this.postsService.remove(id);
  }
}