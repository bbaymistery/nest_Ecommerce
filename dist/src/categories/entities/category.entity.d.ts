import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Timestamp } from 'typeorm/driver/mongodb/bson.typings.js';
export declare class CategoryEntity {
    id: number;
    title: string;
    description: string;
    is_active: boolean;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    addedBy: UserEntity;
    products: ProductEntity[];
}
