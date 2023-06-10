import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from '../../authentication/passport-strategy/access-token.strategy';
import { UserFileUpload } from '../../models/UserFileUpload';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, UserFileUpload]),
    JwtModule.register({}),
  ],
  providers: [UsersResolver, UsersService, AccessTokenStrategy],
})
export class UsersModule {}
