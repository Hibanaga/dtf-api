import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsResolver } from './posts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { PostActivity } from '../../models/PostActivity';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post, PostActivity])],
  providers: [PostsResolver, PostsService],
})
export class PostsModule {}
