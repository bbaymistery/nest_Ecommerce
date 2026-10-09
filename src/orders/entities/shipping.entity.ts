import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

/**
 * SHIPPING ENTITY (Kargo / Teslimat Adresi Veritabanı Tablosu)
 * 
 * Verilen bir siparişin teslim edileceği adres, alıcı adı, kargo firması gibi bilgileri tutar.
 */
@Entity('shippings')
export class ShippingEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  phone: string;

  @Column()
  shippingCompany: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  postcode: string;

  @Column()
  state: string;

  @Column()
  country: string;

  /*
    (@OneToOne - Ters İlişki / Inverse Side)
    - Bu kargo adresi SADECE 1 siparişe aittir.
    - İlişkinin ana sahibi (foreign key tutanı) OrderEntity tarafındadır 
    (@JoinColumn orada olduğu için).
  */
  @OneToOne(() => OrderEntity, (order) => order.shippingAddress)
  order: OrderEntity;
}
