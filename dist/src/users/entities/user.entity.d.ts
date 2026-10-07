import { Timestamp } from 'typeorm/driver/mongodb/bson.typings.js';
import { Roles } from '../../utility/common/user-roles.enum';
export declare class UserEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Roles[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
