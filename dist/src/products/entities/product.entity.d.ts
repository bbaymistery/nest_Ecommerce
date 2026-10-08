import { CategoryEntity } from "src/categories/entities/category.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Timestamp } from "typeorm/driver/mongodb/bson.typings.js";
export declare class ProductEntity {
    id: number;
    title: string;
    description: string;
    price: number;
    stock: number;
    images: string[];
    createdAt: Timestamp;
    updatedAt: Timestamp;
    addedBy: UserEntity;
    category: CategoryEntity;
}
