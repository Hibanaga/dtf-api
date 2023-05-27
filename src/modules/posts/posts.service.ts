import { Injectable } from '@nestjs/common';
import {
  CreateCommentInput,
  CreatePostInput,
  Post,
  UpdatePostInput,
} from 'src/graphql';

import { v4 } from 'uuid';

@Injectable()
export class PostsService {
  private posts: Post[] = [];

  create(body: CreatePostInput) {
    const newPost = {
      ...body,
      id: v4(),
      comments: [],
    };

    this.posts.push(newPost);

    return newPost;
  }

  createComment(body: CreateCommentInput) {
    const post = this.posts.find((post) => post.id === body.postId);

    if (post) {
      const newComment = {
        text: body.text,
        user: body.user,
        date: new Date().toDateString(),
      };

      post.comments.push(newComment);

      console.log('newComment: ', newComment);

      return newComment;
    }
  }

  list() {
    return this.posts;
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
