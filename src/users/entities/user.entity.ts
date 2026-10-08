import { Timestamp } from 'typeorm/driver/mongodb/bson.typings.js';
import { Roles } from '../../utility/common/user-roles.enum';
import { CreateDateColumn, Column, Entity, PrimaryGeneratedColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { ProductEntity } from 'src/products/entities/product.entity';

/**
 * USER ENTITY (Kullanıcı Veritabanı Tablo Şeması)
 * 
 * Soru: Entity nedir? Schema gibi bir işlev görür mü?
 * Cevap: EVET! MongoDB/Mongoose tarafındaki "user.schema.ts" neyse, 
 * TypeORM/PostgreSQL tarafındaki "user.entity.ts" %100 TAM OLARAK ODUR.
 * 
 * @Entity('users') -> PostgreSQL veritabanımızda 'users' adında bir tablo oluşturur.
 */
@Entity('users')
export class UserEntity {
  // @PrimaryGeneratedColumn() -> Otomatik artan (1, 2, 3...) birincil anahtar (Primary Key) kimlik numarası üretir.
  @PrimaryGeneratedColumn()
  id: number;

  // @Column() -> Veritabanında 'name' adında metin (varchar) sütunu oluşturur.
  @Column()
  name: string;

  // @Column() -> Veritabanında 'email' adında metin sütunu oluşturur.
  @Column({ unique: true })
  email: string;

  // @Column() -> Kullanıcının şifresini tutacak sütun.
  //> false means  > SELECT (getirme) sorgularında görünmez.
  @Column({ select: false })
  password: string;

  /**
   * HATA DÜZELTMESİ:
   * 1. TypeORM içinde PostgreSQL dizileri için property adı 'isArray' değil 'array: true' olarak yazılır.
   * 2. 'isArray' yazıldığında TypeORM nesneyi tanıyamayıp kırmızı hata veriyordu. 'array: true' yapınca hata düzeldi.
   */
  @Column({
    type: 'enum',
    enum: Roles,
    array: true, // PostgreSQL içinde birden fazla rol saklamak için array kullanıyoruz
    default: [Roles.USER], // Yeni kaydolan kullanıcının varsayılan rolü 'user' olur
  })
  role: Roles[];

  @CreateDateColumn()
  createdAt: Timestamp;

  @UpdateDateColumn()
  updatedAt: Timestamp;

  //I means a user can have multiple categories
  @OneToMany(() => CategoryEntity, (category) => category.addedBy)
  categories: CategoryEntity[];

  //it means  a user can have multiple products
  @OneToMany(() => ProductEntity, (product) => product.addedBy)
  products: ProductEntity[];
}



/*
Entity (UserEntity): Neon PostgreSQL veritabanınızdaki GERÇEK TABLO ŞEMASIDIR.
Amacı: Veritabanı sütunlarını (id, name, email, password, role, createdAt) tanımlamaktır.
Neden Farklılar? Kullanıcı kaydolurken DTO sadece name, email, password alır. 
Ancak veritabanına (Entity) kaydolurken bunlara ek olarak otomatik id, 
varsayılan role: ["user"] gibi dışarıdan gönderilmeyen iç veriler de eklenir.
*/