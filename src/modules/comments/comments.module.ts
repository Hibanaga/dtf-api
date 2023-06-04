import { Module } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CommentsResolver } from './comments.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { Post } from '../../models/Post';
import { Comment } from '../../models/Comment';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, Comment])],
  providers: [CommentsResolver, CommentsService],
})
export class CommentsModule {}
