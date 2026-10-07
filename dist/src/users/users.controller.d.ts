import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(userSignUpDto: UserSignUpDto): Promise<UserEntity>;
    signin(userSignInDto: UserSignInDto): Promise<UserEntity>;
}
