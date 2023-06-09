import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { PostsModule } from './modules/posts/posts.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { validate } from './config/env.validation';
import { UsersModule } from './modules/users/users.module';
import typeormCliConfig from '../typeorm-cli.config';
import { GraphQLError, GraphQLFormattedError } from 'graphql';
import { CommentsModule } from './modules/comments/comments.module';
import { AwsS3Module } from './modules/aws-s3/aws-s3.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: () => typeormCliConfig.options,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      context: ({ req }) => ({ req }),
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
        outputAs: 'class',
      },
      playground: true,
      formatError: (error: GraphQLError) => {
        const graphQLFormattedError: GraphQLFormattedError = {
          message: error.message,
        };
        return graphQLFormattedError;
      },
    }),
    CommentsModule,
    PostsModule,
    UsersModule,
    AwsS3Module,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
