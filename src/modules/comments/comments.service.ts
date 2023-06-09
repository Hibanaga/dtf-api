import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../models/Comment';
import {
  CreateCommentInput,
  LikeUnlikeCommentInput,
  ReactionType as GraphqlReactionType,
  UpdateCommentInput,
} from '../../graphql';
import { Post } from '../../models/Post';
import { User } from '../../models/User';
import { ReactionTypeCountParams } from '../posts/posts.service';
import { CommentActivity } from '../../models/CommentActivity';
import { ReactionType } from 'src/types/ActivityStatus';
import { PaginationParams } from '../../types/Pagination';
import { PaginateService } from '../../services/paginate.service';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(CommentActivity)
    private commentActivityRepository: Repository<CommentActivity>,
    private paginateService: PaginateService,
  ) {}

  async list(args): Promise<PaginationParams<Comment>> {
    const queryBuilder = await this.commentRepository.createQueryBuilder();
    const meta = await this.paginateService.paginate(queryBuilder, args);

    return {
      edges: await queryBuilder.getMany(),
      pageInfo: meta,
    };
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

  async likeUnlike(input: LikeUnlikeCommentInput) {
    const ideticationParams = {
      postId: input.postId,
      userId: input.userId,
      commentId: input.commentId,
    };

    try {
      const post = await this.commentRepository.findOne({
        where: {
          id: input.commentId,
          userId: input.userId,
          postId: input.postId,
        },
      });

      const reactTypeCondition =
        input.reactionType === GraphqlReactionType.like
          ? ReactionType.Like
          : ReactionType.Dislike;

      if (!post) {
        throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
      }

      const commentActivity = await this.commentActivityRepository.findOne({
        where: ideticationParams,
      });

      if (!commentActivity) {
        const likedUnlikeComment = await this.commentActivityRepository.save({
          ...ideticationParams,
          reactionType: reactTypeCondition,
        });

        if (!likedUnlikeComment) {
          throw new HttpException(
            'Something went wrong!',
            HttpStatus.BAD_REQUEST,
          );
        }

        return !!(await this.commentRepository.update(input.commentId, {
          likeCount:
            likedUnlikeComment.reactionType === ReactionType.Like
              ? post.likeCount + 1
              : post.likeCount,
          dislikeCount:
            likedUnlikeComment.reactionType === ReactionType.Dislike
              ? post.dislikeCount + 1
              : post.dislikeCount,
        }));
      }

      if (
        commentActivity.reactionType === ReactionType.Like &&
        input.reactionType === GraphqlReactionType.like
      ) {
        return await this.likeUnlikeDuplicates(
          commentActivity,
          post,
          input.commentId,
          ReactionTypeCountParams.LikeCount,
        );
      }

      if (
        commentActivity.reactionType === ReactionType.Dislike &&
        input.reactionType === GraphqlReactionType.dislike
      ) {
        return await this.likeUnlikeDuplicates(
          commentActivity,
          post,
          input.commentId,
          ReactionTypeCountParams.DislikeCount,
        );
      }

      if (commentActivity) {
        const likedUnlikePost = await this.commentActivityRepository.update(
          ideticationParams,
          { reactionType: reactTypeCondition },
        );

        if (!likedUnlikePost) {
          throw new HttpException(
            'Something went wrong!',
            HttpStatus.BAD_REQUEST,
          );
        }

        return !!(await this.commentRepository.update(input.commentId, {
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

    return true;
  }

  async remove(id: string) {
    try {
      const comment = await this.single(id);

      if (!comment) {
        throw new HttpException('Not found!', HttpStatus.BAD_REQUEST);
      }

      const status = await this.commentRepository.remove(comment);

      if (!status) {
        throw new HttpException(
          'Something went wrong!',
          HttpStatus.BAD_REQUEST,
        );
      }

      return true;
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

  async likeUnlikeDuplicates(
    commentActivity: CommentActivity,
    comment: Comment,
    commentId: string,
    reactionType: ReactionTypeCountParams,
  ) {
    const removeLike = await this.commentActivityRepository.remove(
      commentActivity,
    );

    if (!removeLike) {
      throw new HttpException('Something went wrong!', HttpStatus.BAD_REQUEST);
    }

    const status = await this.commentRepository.update(commentId, {
      [reactionType]: comment[reactionType] - 1,
    });

    return !!status;
  }
}
