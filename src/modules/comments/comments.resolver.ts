import { Args, Info, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';
import {
  CreateCommentInput,
  LikeUnlikeCommentInput,
  UpdateCommentInput,
} from '../../graphql';
import { Comment } from '../../models/Comment';
import { NestedObject, PaginationParams } from '../../types/Options';
import { FieldNode, GraphQLResolveInfo } from 'graphql';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentsService: CommentsService) {}

  @Query('comments')
  async list(
    @Args('input') input,
    @Info() info: GraphQLResolveInfo,
  ): Promise<PaginationParams<Comment>> {
    const requestedFields = this.getRequestedFields(info.fieldNodes[0]);
    return await this.commentsService.list(input, requestedFields);
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
