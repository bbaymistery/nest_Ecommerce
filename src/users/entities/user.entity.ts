import { Roles } from '../../utility/common/user-roles.enum';
import { CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { ReviewEntity } from 'src/reviews/entities/review.entity';

/**
 * USER ENTITY (Kullanıcı Veritabanı Tablo Şeması)
 * 
 * @Entity('users') -> PostgreSQL veritabanımızda 'users' adında bir tablo oluşturur.
 */
@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @Column({
    type: 'enum',
    enum: Roles,
    array: true,
    default: [Roles.USER],
  })
  role: Roles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => CategoryEntity, (category) => category.addedBy)
  categories: CategoryEntity[];

  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];

  //it means one user can write many reviews
  @OneToMany(() => ReviewEntity, (review) => review.user)
  reviews: ReviewEntity[];
}