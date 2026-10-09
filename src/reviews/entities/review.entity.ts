import { ProductEntity } from "src/products/entities/product.entity";
import { UserEntity } from "src/users/entities/user.entity";
import { Column, PrimaryGeneratedColumn, UpdateDateColumn, CreateDateColumn, ManyToOne, Entity } from "typeorm";

@Entity('reviews')
export class ReviewEntity {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    ratings: number;

    @Column()
    comment: string;

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
    //it means that one user can write many reviews and one review belongs to one user
    @ManyToOne(() => UserEntity, (user) => user.reviews)
    user: UserEntity;

    //it means that one product can have many reviews and one review belongs to one product
    @ManyToOne(() => ProductEntity, (product) => product.reviews)
    product: ProductEntity;
}
