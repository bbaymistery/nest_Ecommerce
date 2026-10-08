import { CategoryEntity } from "src/categories/entities/category.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from "typeorm";

@Entity('products')
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
    images: string[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    // Çoktan-Bir'e İlişki: Bir kullanıcının (Admin) birden fazla eklediği ürün olabilir
    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    // Çoktan-Bir'e İlişki: Bir ürünün sadece tek bir kategorisi olabilir
    @ManyToOne(() => CategoryEntity, (category) => category.products)
    category: CategoryEntity;
}
