import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterInput } from 'src/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from '../../utils/password';
import { invalidateFalsy } from '../../utils/object';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(input: RegisterInput) {
    const existingUser = await this.userRepository.findOne({
      where: {
        email: input.email,
      },
    });

    if (existingUser) {
      throw new HttpException(
        'Email already registered!',
        HttpStatus.BAD_REQUEST,
      );
    }

    const protectedPassword = await hashPassword(input.password);

    const body = {
      ...input,
      password: protectedPassword,
      imageKey: null,
    };

    return await this.userRepository.save(invalidateFalsy(body));
  }
}
