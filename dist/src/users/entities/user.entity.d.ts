import { Roles } from 'src/utility/common/user-roles.enum';
export declare class UserEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Roles[];
}
