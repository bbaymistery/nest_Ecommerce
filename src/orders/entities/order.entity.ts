import { Entity, Column, CreateDateColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { OrderStatus } from "../enums/oder-status.enum";
import { UserEntity } from "src/users/entities/user.entity";
import { ShippingEntity } from "./shipping.entity";
import { OrdersProductsEntity } from "./orders-products.entity";

/**
 * ORDER ENTITY (Sipariş Veritabanı Tablosu)
 * 
 * E-Ticaret sisteminde verilen bir siparişin tüm durum ve ilişki bilgilerini tutar.
 */
@Entity('orders')
export class OrderEntity {

  @PrimaryGeneratedColumn()
  id: number;

  @CreateDateColumn()
  orderAt: Date;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PROCESSING })
  status: string;

  @Column({ nullable: true })
  shippedAt: Date;

  @Column({ nullable: true })
  deliveredAt: Date;

  /*
    (@ManyToOne - Çoktan Bire İlişki)
    Siparişi Güncelleyen Yetkili (Admin):
    - 1 Admin / Yetkili Kullanıcı BİNLERCE siparişin durumunu güncelleyebilir 
    (Kargolandı, Teslim Edildi vs.)
    - Ama 1 Siparişteki o güncellemeyi SADECE 1 Yetkili yapmıştır.
  */
  @ManyToOne(() => UserEntity, (user) => user.ordersUpdatedBy)
  updatedBy: UserEntity;

  /*
    (@OneToOne - Bire Bir İlişki)
    Sipariş Kargo Adresi (Shipping Address):
    - 1 Siparişin SADECE 1 TANE kargo/adres teslimat bilgisi olur.
    - 1 Kargo adresi kaydı da SADECE 1 Siparişe aittir.

    cascade: true nedir?
    Siparişi kaydederken (orderRepository.save) 
     kargo adresini de içine nesne olarak koyarsak,
    TypeORM otomatik olarak kargo adresini de shippings tablosuna kaydeder.
    Ekstra shippingRepository.save() yapmamıza gerek kalmaz.

    @JoinColumn() nedir?
    PostgreSQL'de foreign key (dış anahtar) sütununun 
     "orders" tablosunda oluşturulacağını söyler.
    Yani "orders" tablosunda "shippingAddressId" sütunu açılır.
  */
  @OneToOne(() => ShippingEntity, (shipping) => shipping.order, { cascade: true })
  @JoinColumn()
  shippingAddress: ShippingEntity;


  /*
    (@OneToMany - Birden Çoka İlişki)
    Sipariş Kalemleri (OrdersProducts):
    - 1 Siparişin altında BİNLERCE sipariş kalemi (ürün satırı) bulunabilir.
    - cascade: true sayesinde siparişi kaydederken
      içindeki tüm ürün kalemleri de otomatik kaydedilir.
  */
  @OneToMany(() => OrdersProductsEntity, (op) => op.order, { cascade: true })
  products: OrdersProductsEntity[];


  @ManyToOne(() => UserEntity, (user) => user.orders)
  user: UserEntity;

}
