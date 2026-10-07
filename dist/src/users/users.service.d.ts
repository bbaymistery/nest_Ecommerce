import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UserSignUpDto } from './dto/user-sign-up.dto';
import { UserSignInDto } from './dto/user-signin.dto';
import { UpdateUserDto } from './dto/update-user.dto';
export declare class UsersService {
    private readonly userRepository;
    constructor(userRepository: Repository<UserEntity>);
    signup(userSignUpDto: UserSignUpDto): Promise<UserEntity>;
    signin(userSignInDto: UserSignInDto): Promise<UserEntity>;
    accesToken(user: UserEntity): Promise<string>;
    findAll(): Promise<UserEntity[]>;
    findById(id: number): Promise<UserEntity>;
    update(id: number, userUpdateDto: UpdateUserDto): Promise<UserEntity>;
    delete(id: number): Promise<UserEntity>;
    findUserByEmail(email: string): Promise<UserEntity | null>;
}
