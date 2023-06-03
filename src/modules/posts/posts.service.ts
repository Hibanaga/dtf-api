import { Injectable } from '@nestjs/common';
import {
  CreateCommentInput,
  CreatePostInput,
  UpdatePostInput,
} from 'src/graphql';

@Injectable()
export class PostsService {
  create(body: CreatePostInput) {}

  createComment(body: CreateCommentInput) {}

  list() {
    return [];
  }

  single(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostInput: UpdatePostInput) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
