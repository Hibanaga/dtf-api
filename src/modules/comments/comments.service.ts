import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../models/Comment';
import {
  CreateCommentInput,
  LikeUnlikeCommentInput,
  UpdateCommentInput,
} from '../../graphql';
import { Post } from '../../models/Post';
import { User } from '../../models/User';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
  ) {}

  async list(): Promise<Comment[]> {
    return await this.commentRepository.find();
  }

  async single(id: string): Promise<Comment> {
    return await this.commentRepository.findOne({
      where: { id },
    });
  }

  async create(input: CreateCommentInput): Promise<Comment> {
    try {
      const isExistUser = await this.existsUser(input.userId);
      if (!isExistUser) {
        throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
      }

      const isExistPost = await this.existsPost(input.postId);
      if (!isExistPost) {
        throw new HttpException('Post not found!', HttpStatus.BAD_REQUEST);
      }

      return await this.commentRepository.save(input);
    } catch (e) {
      return e;
    }
  }

  async update(input: UpdateCommentInput) {
    try {
      const isExistComment = await this.existsComment(input.id);
      if (!isExistComment) {
        throw new HttpException('Comment not found!', HttpStatus.BAD_REQUEST);
      }

      const isExistUser = await this.existsUser(input.userId);
      if (!isExistUser) {
        throw new HttpException('User not found!', HttpStatus.BAD_REQUEST);
      }

      const isExistPost = await this.existsPost(input.postId);
      if (!isExistPost) {
        throw new HttpException('Post not found!', HttpStatus.BAD_REQUEST);
      }

      await this.commentRepository.update(input.id, input);
      return await this.single(input.id);
    } catch (e) {
      return e;
    }
  }

  async existsUser(id: string) {
    return this.userRepository.exist({
      where: { id },
    });
  }

  async existsPost(id: string) {
    return this.postRepository.exist({
      where: { id },
    });
  }

  async existsComment(id: string) {
    return this.commentRepository.exist({
      where: { id },
    });
  }
}
