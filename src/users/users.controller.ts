import { Controller, Post, Body, } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("signup")
  async signup(@Body() userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    return await this.usersService.signup(userSignUpDto);
  }

  @Post("signin")
  async signin(@Body() userSignInDto: UserSignInDto): Promise<UserEntity> {
    return await this.usersService.signin(userSignInDto);
  }
}
