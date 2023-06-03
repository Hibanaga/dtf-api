import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { JwtModule } from '@nestjs/jwt';
import { Post } from '../../models/Post';

@Module({
  imports: [TypeOrmModule.forFeature([User, Post]), JwtModule.register({})],
  providers: [UsersResolver, UsersService],
})
export class UsersModule {}
