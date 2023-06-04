import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import { CreateCommentInput, UpdateCommentInput } from '../../graphql';
import { Comment } from '../../models/Comment';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query('comments')
  async list(): Promise<Comment[]> {
    return await this.commentsService.list();
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
}
