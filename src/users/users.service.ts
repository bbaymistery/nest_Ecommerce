import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import * as bcrypt from 'bcrypt';
import { UserSignInDto } from './dto/user-signin.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) { }

  async signup(userSignUpDto: UserSignUpDto): Promise<UserEntity> {

    //checking if the user already exists
    const existingUser = await this.findUserByEmail(userSignUpDto.email);
    if (existingUser) {
      throw new BadRequestException('Bu email adresi zaten kullanılıyor.');
    }

    //password hashing
    const hashedPassword = await bcrypt.hash(userSignUpDto.password, 10);
    userSignUpDto.password = hashedPassword;

    const user = this.userRepository.create(userSignUpDto);
    return await this.userRepository.save(user);
  }

  async signin(userSignInDto: UserSignInDto): Promise<UserEntity> {
    // .addSelect('user.password') ile gizli olan şifreyi SADECE Giriş Yaparken özel olarak çekiyoruz
    const user = await this.userRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email: userSignInDto.email })
      .getOne();

    if (!user) {
      throw new BadRequestException('Kullanıcı bulunamadı.');
    }

    const isPasswordValid = await bcrypt.compare(userSignInDto.password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException('Şifre yanlış.');
    }
    return user;
  }

  /**
   * Kullanıcının email adresine göre bulunması
   * @param email email adresi
   * @returns Kullanıcı entity
   */
  async findUserByEmail(email: string): Promise<UserEntity | null> {
    return await this.userRepository.findOneBy({ email });
  }
}
