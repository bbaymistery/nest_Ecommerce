import { Roles } from '../../utility/common/user-roles.enum';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
  @Column()
  email: string;

  // @Column() -> Kullanıcının şifresini tutacak sütun.
  @Column()
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
}
