import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';
import { CommentActivity } from '../../models/CommentActivity';
import { PaginateService } from '../../services/paginate.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment, CommentActivity])],
  providers: [PaginateService, CommentsResolver, CommentsService],
})
export class CommentsModule {}
