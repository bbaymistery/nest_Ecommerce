import { ProductEntity } from "src/products/entities/product.entity";
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { OrderEntity } from "./order.entity";

/**
 * ORDERS_PRODUCTS ENTITY (Sipariş Kalemleri / Ara Tablo - Pivot Table)
 * 
 * Neden Bu Tablo Var?
 * 1. Sipariş (Order) ile Ürün (Product) arasında ÇOKTAN-ÇOKA (Many-to-Many) ilişki vardır.
 *    (Bir siparişte birden çok ürün olabilir, bir ürün de birden çok siparişte satılabilir).
 * 2. Ayrıca sipariş anındaki ürün fiyatı (product_unit_price) ve satın alınan adet (product_quantity) 
 *    bilgisini saklamak için bu ARA TABLO (Junction Table) zorunludur.
 */
@Entity({ name: "orders_products" })
export class OrdersProductsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // Siparişin verildiği andaki birim fiyat (Ürün fiyatı gelecekte değişse bile sipariş tarihi fiyatı sabit kalır)
  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  product_unit_price: number;

  // Bu üründen kaç adet sipariş edildi?
  @Column()
  product_quantity: number;

  /*
    (@ManyToOne - Çoktan Bire İlişki)
    - Bu sipariş kalemi SADECE 1 TANE siparişe (Order) aittir.
  */
  @ManyToOne(() => OrderEntity, (order) => order.products)
  order: OrderEntity;

  /*
    (@ManyToOne - Çoktan Bire İlişki)
    - Bu sipariş kalemi SADECE 1 TANE ürüne (Product) aittir.
  */
  @ManyToOne(() => ProductEntity, (prod) => prod.products, { cascade: true })
  product: ProductEntity;

}
