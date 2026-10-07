import { UsersService } from './users.service';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserEntity } from './entities/user.entity';
import { UserSignInDto } from './dto/user-signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    signup(userSignUpDto: UserSignUpDto): Promise<UserEntity>;
    signin(userSignInDto: UserSignInDto): Promise<{
        accesToken: string;
        user: UserEntity;
    }>;
    findAll(): Promise<UserEntity[]>;
    getProfile(currentUser: UserEntity): Promise<UserEntity>;
    findById(id: number): Promise<UserEntity | null>;
    update(id: number, userUpdateDto: UpdateUserDto): Promise<UserEntity>;
    delete(id: number): Promise<{
        message: string;
        user: UserEntity | null;
    }>;
}
