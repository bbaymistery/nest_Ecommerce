import { CategoryEntity } from "src/categories/entities/category.entity";
import { OrdersProductsEntity } from "src/orders/entities/orders-products.entity";
import { ReviewEntity } from "src/reviews/entities/review.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from "typeorm";

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
    /*
    Instagram Gönderisi ve Yorumlar:
    
    (@OneToMany).
    Instagram Postu (Product): Bir postun altında BİNLERCE yorum olabilir 
    
    (@ManyToOne).
    Atılan Yorum (Review): O yorum SADECE 1 TANE postun altındadır 
    */
    // Çoktan-Bir'e İlişki: Bir kullanıcının (Admin) birden fazla eklediği ürün olabilir
    @ManyToOne(() => UserEntity, (user) => user.products)
    addedBy: UserEntity;

    // Çoktan-Bir'e İlişki: Bir ürünün sadece tek bir kategorisi olabilir
    @ManyToOne(() => CategoryEntity, (category) => category.products)
    category: CategoryEntity;

    // it means one product can have many reviews
    @OneToMany(() => ReviewEntity, (review) => review.product)
    reviews: ReviewEntity[];
    // Çoktan-Çoka Ara İlişkisi: 1 Ürün birden fazla sipariş kaleminde (OrdersProducts) yer alabilir
    @OneToMany(() => OrdersProductsEntity, (op) => op.product)
    products: OrdersProductsEntity[];
}
