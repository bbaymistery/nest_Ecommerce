import { Controller, Post, Body, Get, Param, Patch, Delete, UnauthorizedException, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeRoles } from 'src/utility/decorators/authorize-roles.decorator';
import { Roles } from 'src/utility/common/user-roles.enum';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post("signup")
  async signup(@Body() userSignUpDto: UserSignUpDto): Promise<UserEntity> {
    return await this.usersService.signup(userSignUpDto);
  }

  @Post("signin")
  async signin(@Body() userSignInDto: UserSignInDto): Promise<{ accesToken: string, user: UserEntity }> {
    const user = await this.usersService.signin(userSignInDto);
    const accesToken = await this.usersService.accesToken(user);
    return { accesToken, user }
  }

  @AuthorizeRoles(Roles.ADMIN)
  @UseGuards(AuthenticationGuard, AuthorizeGuard)
  @Get()
  async findAll(): Promise<UserEntity[]> {
    return await this.usersService.findAll();
  }

  // O anki giriş yapmış kullanıcının kendi profilini getirme
  @UseGuards(AuthenticationGuard)
  @Get("me")
  async getProfile(@CurrentUser() currentUser: UserEntity): Promise<UserEntity> {
    if (!currentUser) {
      throw new UnauthorizedException('Geçerli bir Token bulunamadı. Lütfen önce giriş yapın.');
    }
    return currentUser;
  }

  @Get(":id")
  async findById(@Param("id") id: number): Promise<UserEntity | null> {
    return await this.usersService.findById(+id);
  }

  @Patch(":id")
  async update(@Param("id") id: number, @Body() userUpdateDto: UpdateUserDto): Promise<UserEntity> {
    return await this.usersService.update(+id, userUpdateDto);
  }

  @Delete(":id")
  async delete(@Param("id") id: number): Promise<{ message: string, user: UserEntity | null }> {
    const user = await this.usersService.delete(+id);
    return { message: "User deleted successfully", user }
  }
}
