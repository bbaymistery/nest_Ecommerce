import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';
import { sign, SignOptions } from 'jsonwebtoken';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) { }

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    // 1. Zaten kayıtlı mı kontrolü (409 Conflict)
    const existingUser = await this.findUserByEmail(userSignUpDto.email);
    if (existingUser) {
      throw new ConflictException('Bu email adresi zaten kullanılıyor.');
    }

    // 2. Şifre Hashleme
    userSignUpDto.password = await bcrypt.hash(userSignUpDto.password, 10);

    const user = this.userRepository.create(userSignUpDto);
    return await this.userRepository.save(user);
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: userSignInDto.email })
      .getOne();

    // Güvenlik İlkesi (User Enumeration Önleme): İkisine de 401 Unauthorized verilir
    if (!user) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }

    const isPasswordValid = await bcrypt.compare(
      userSignInDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('E-posta veya şifre hatalı.');
    }
    return user;
  }

  async accesToken(user: UserEntity): Promise<string> {
    return sign(
      { id: user.id, email: user.email },
      process.env.JWT_ACCESS_TOKEN_SECRET as string,
      { expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE_TIME } as SignOptions,
    );
  }

  async findAll(): Promise<UserEntity[]> {
    return await this.userRepository.find();
  }

  async findById(id: number): Promise<UserEntity> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`ID'si ${id} olan kullanıcı bulunamadı.`);
    }
    return user;
  }

  async update(id: number, userUpdateDto: UpdateUserDto): Promise<UserEntity> {
    // findById kullanıcının olup olmadığını zaten kontrol ediyor ve yoksa 404 fırlatıyor (DRY)
    const user = await this.findById(id);
    return await this.userRepository.save({ ...user, ...userUpdateDto });
  }

  async delete(id: number): Promise<UserEntity> {
    // findById kullanıcının olup olmadığını zaten kontrol ediyor ve yoksa 404 fırlatıyor (DRY)
    const user = await this.findById(id);
    return await this.userRepository.remove(user);
  }

  /**
   * Kullanıcının email adresine göre bulunması
   */
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }
}
