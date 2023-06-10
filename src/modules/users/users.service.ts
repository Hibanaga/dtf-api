import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JWTTokens, RegisterInput, SignInInput } from 'src/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../../models/User';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { hashPassword } from '../../utils/password';
import { invalidateFalsy } from '../../utils/object';
import { compare } from 'bcrypt';
import { UserFileUpload } from '../../models/UserFileUpload';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(UserFileUpload)
    private userFileUploadRepository: Repository<UserFileUpload>,
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
    };

    const newUser = await this.userRepository.save(invalidateFalsy(body));

    if (input?.fileUploadId && newUser.id) {
      await this.userFileUploadRepository.save({
        userId: newUser.id,
        uploadFileId: input.fileUploadId,
      });
    }

    return newUser;
  }

  async login(input: SignInInput) {
    const user = await this.userRepository.findOne({
      where: { email: input.email },
    });

    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    const isValidPass = await compare(input.password, user.password);

    if (!isValidPass) {
      throw new HttpException('Invalid credentials', HttpStatus.BAD_REQUEST);
    }

    return this.getTokens(user);
  }

  async single(id: string) {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  async getTokens(user: User): Promise<JWTTokens> {
    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.email,
        },
        {
          secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRATION',
          ),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
    };
  }
}
