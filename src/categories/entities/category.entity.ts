import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity('categories')
export class CategoryEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column({ default: true })
    is_active: boolean = true;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // user can create many categories
    @ManyToOne(() => UserEntity, (user) => user.categories)
    addedBy: UserEntity;

    // category can have multiple products
    @OneToMany(() => ProductEntity, (product) => product.category)
    products: ProductEntity[];
}
