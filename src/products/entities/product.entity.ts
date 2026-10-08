import { CategoryEntity } from "src/categories/entities/category.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";
import { Timestamp } from "typeorm/driver/mongodb/bson.typings.js";

@Entity()
export class ProductEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    price: number;

    @Column()
    stock: number;

    @Column('simple-array')
    image: string[];

    @CreateDateColumn()
    createdAt: Timestamp;

    @UpdateDateColumn()
    updatedAt: Timestamp;

    //it means a user can have multiple products
    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    //iT MEANS A product can have one category
    @ManyToOne(() => CategoryEntity, (category) => category.products)
    category: CategoryEntity;
}
