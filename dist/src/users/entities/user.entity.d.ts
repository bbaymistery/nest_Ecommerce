import { Timestamp } from 'typeorm/driver/mongodb/bson.typings.js';
import { Roles } from '../../utility/common/user-roles.enum';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
export declare class UserEntity {
    id: number;
    name: string;
    email: string;
    password: string;
    role: Roles[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    categories: CategoryEntity[];
    products: ProductEntity[];
}
