import { Injectable } from '@nestjs/common';
import { CreatePostInput, UpdatePostInput } from 'src/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../models/Post';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) {}

  async create(input: CreatePostInput) {
    return await this.postRepository.save(input);
  }

  async update(input: UpdatePostInput) {}

  async list() {
    return await this.postRepository.find();
  }

  single(id: number) {
    return '';
  }

  remove(id: number) {
    return '';
  }
}
