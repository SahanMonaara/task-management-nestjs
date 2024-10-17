import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcryptjs from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { JwtPayLoad } from './jwt-payload.interface';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) // Inject the TypeORM repository
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async createUser(authCredentialsDto: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentialsDto;

    const salt = await bcryptjs.genSalt();
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = this.userRepository.create({
      username,
      password: hashedPassword,
    });
    try {
      await this.userRepository.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findUser(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const { username, password } = authCredentialsDto;
    try {
      const user = await this.userRepository.findOneBy({ username });
      if (user && (await bcryptjs.compare(password, user.password))) {
        const payLoad: JwtPayLoad = { username };
        const accessToken = await this.jwtService.sign(payLoad);
        return { accessToken };
      } else {
        throw new UnauthorizedException('Please check your login credentials');
      }
    } catch (error) {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }

  async findOne(payload: JwtPayLoad): Promise<User> {
    const user: User = await this.userRepository.findOneBy({
      username: payload.username,
    });
    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
