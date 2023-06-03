import { Resolver } from '@nestjs/graphql';
import { CommentsService } from './comments.service';

@Resolver('Comment')
export class CommentsResolver {
  constructor(private readonly commentService: CommentsService) {}
}
