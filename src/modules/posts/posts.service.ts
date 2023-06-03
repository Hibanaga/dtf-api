import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreatePostInput,
  DislikePostInput,
  LikePostInput,
  UpdatePostInput,
} from 'src/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../models/Post';
import { User } from '../../models/User';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async list() {
    return await this.postRepository.find();
  }

  single(id: string) {
    return this.postRepository.findOne({
      where: {
        id: id,
      },
    });
  }

  async create(input: CreatePostInput) {
    try {
      const isExistUser = await this.userRepository.exist({
        where: {
          id: input.userId,
        },
      });

      if (!isExistUser) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      return await this.postRepository.save(input);
    } catch (e) {
      return e;
    }
  }

  async update(input: UpdatePostInput) {
    try {
      const isUserExists = await this.userRepository.exist({
        where: { id: input.userId },
      });

      if (!isUserExists) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      await this.postRepository.update(input.id, input);
      return await this.postRepository.findOne({ where: { id: input.id } });
    } catch (e) {
      return e;
    }
  }

  async likePost(input: LikePostInput) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id: input.id,
          userId: input.userId,
        },
      });

      if (!post) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const { id, ...postParams } = post;
      return await this.postRepository.update(id, {
        likeCount: postParams.likeCount + 1,
      });
    } catch (e) {
      return e;
    }
  }

  async dislikePost(input: DislikePostInput) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id: input.userId,
        },
      });

      if (!post) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const { id, ...postParams } = post;
      return await this.postRepository.update(id, {
        ...postParams,
        dislikeCount: postParams.dislikeCount + 1,
      });
    } catch (e) {
      return e;
    }
  }

  async remove(id: string) {
    try {
      const post = await this.postRepository.findOne({
        where: {
          id,
        },
      });

      if (!post) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      return await this.postRepository.remove(post);
    } catch (e) {
      return e;
    }
  }
}
