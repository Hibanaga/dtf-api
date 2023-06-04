import { Injectable } from '@nestjs/common';
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
      where: {
        id,
      },
    });
  }

  async create(input: CreateCommentInput): Promise<Comment> {
    try {
      return await this.single(input.id);
    } catch (e) {
      return e;
    }
  }

  async update(input: UpdateCommentInput) {
    return await this.single(input.id);
  }

  async likeUnlike(input: LikeUnlikeCommentInput) {}
}
