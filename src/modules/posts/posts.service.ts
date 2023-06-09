import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  CreatePostInput,
  LikeUnlikePostInput,
  ReactionType as GraphqlReactionType,
  UpdatePostInput,
} from 'src/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { PostActivity } from '../../models/PostActivity';
import { ReactionType } from '../../types/ActivityStatus';
import { PaginateService } from '../../services/paginate.service';

export enum ReactionTypeCountParams {
  LikeCount = 'likeCount',
  DislikeCount = 'dislikeCount',
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(PostActivity)
    private postActivityRepository: Repository<PostActivity>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
    private paginateService: PaginateService,
  ) {}

  async list(args) {
    const queryBuilder = await this.postRepository.createQueryBuilder();
    const meta = await this.paginateService.paginate(queryBuilder, args);

    return {
      edges: await queryBuilder.getMany(),
      pageInfo: meta,
    };
  }

  async single(id: string) {
    return await this.postRepository.findOne({
      where: { id: id },
    });
  }

  async create(input: CreatePostInput) {
    try {
      const isExistUser = await this.checkUserExists(input.userId);

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
      const isUserExists = await this.checkUserExists(input.userId);

      if (!isUserExists) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      await this.postRepository.update(input.id, input);
      return await this.single(input.id);
    } catch (e) {
      return e;
    }
  }

  async remove(id: string) {
    try {
      const post = await this.single(id);

      if (!post) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      return await this.postRepository.remove(post);
    } catch (e) {
      return e;
    }
  }

  async likeUnlike(input: LikeUnlikePostInput) {
    const ideticationParams = { postId: input.postId, userId: input.userId };

    try {
      const post = await this.postRepository.findOne({
        where: {
          id: input.postId,
          userId: input.userId,
        },
      });

      const reactTypeCondition =
        input.reactionType === GraphqlReactionType.like
          ? ReactionType.Like
          : ReactionType.Dislike;

      if (!post) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const postActivity = await this.postActivityRepository.findOne({
        where: ideticationParams,
      });

      if (!postActivity) {
        const likedUnlikePost = await this.postActivityRepository.save({
          ...ideticationParams,
          reactionType: reactTypeCondition,
        });

        if (!likedUnlikePost) {
          throw new HttpException(
            'Something went wrong!',
            HttpStatus.BAD_REQUEST,
          );
        }

        return !!(await this.postRepository.update(input.postId, {
          likeCount:
            likedUnlikePost.reactionType === ReactionType.Like
              ? post.likeCount + 1
              : post.likeCount,
          dislikeCount:
            likedUnlikePost.reactionType === ReactionType.Dislike
              ? post.dislikeCount + 1
              : post.dislikeCount,
        }));
      }

      if (
        postActivity.reactionType === ReactionType.Like &&
        input.reactionType === GraphqlReactionType.like
      ) {
        return await this.likeUnlikeDuplicates(
          postActivity,
          post,
          input.postId,
          ReactionTypeCountParams.LikeCount,
        );
      }

      if (
        postActivity.reactionType === ReactionType.Dislike &&
        input.reactionType === GraphqlReactionType.dislike
      ) {
        return await this.likeUnlikeDuplicates(
          postActivity,
          post,
          input.postId,
          ReactionTypeCountParams.DislikeCount,
        );
      }

      if (postActivity) {
        const likedUnlikePost = await this.postActivityRepository.update(
          ideticationParams,
          { reactionType: reactTypeCondition },
        );

        if (!likedUnlikePost) {
          throw new HttpException(
            'Something went wrong!',
            HttpStatus.BAD_REQUEST,
          );
        }

        return !!(await this.postRepository.update(input.postId, {
          likeCount:
            input.reactionType === GraphqlReactionType.like
              ? post.likeCount + 1
              : post.likeCount - 1,
          dislikeCount:
            input.reactionType === GraphqlReactionType.dislike
              ? post.dislikeCount + 1
              : post.dislikeCount - 1,
        }));
      }

      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    } catch (e) {
      return e;
    }
  }

  async checkUserExists(userId: string): Promise<boolean> {
    return await this.userRepository.exist({
      where: { id: userId },
    });
  }

  async likeUnlikeDuplicates(
    postActivity: PostActivity,
    post: Post,
    postId: string,
    reactionType: ReactionTypeCountParams,
  ) {
    const removeLike = await this.postActivityRepository.remove(postActivity);

    if (!removeLike) {
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }

    const status = await this.postRepository.update(postId, {
      [reactionType]: post[reactionType] - 1,
    });

    return !!status;
  }
}
