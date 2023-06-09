import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import {
  CreateCommentInput,
  LikeUnlikeCommentInput,
  UpdateCommentInput,
} from '../../graphql';
import { Comment } from '../../models/Comment';
import { PaginationParams } from '../../types/Pagination';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query('comments')
  async list(@Args('input') input): Promise<PaginationParams<Comment>> {
    return await this.commentsService.list(input);
  }

  @Query('comment')
  async single(@Args('id') id: string): Promise<Comment> {
    return await this.commentsService.single(id);
  }

  @Mutation('createComment')
  async create(@Args('input') input: CreateCommentInput): Promise<Comment> {
    return await this.commentsService.create(input);
  }

  @Mutation('updateComment')
  async update(@Args('input') input: UpdateCommentInput): Promise<Comment> {
    return await this.commentsService.update(input);
  }

  @Mutation('removeComment')
  async remove(@Args('id') id: string): Promise<boolean> {
    return await this.commentsService.remove(id);
  }

  @Mutation('likeUnlikeComment')
  async likeUnlike(
    @Args('input') input: LikeUnlikeCommentInput,
  ): Promise<boolean> {
    return await this.commentsService.likeUnlike(input);
  }
}
