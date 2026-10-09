import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductEntity } from 'src/products/entities/product.entity';
import { OrderStatus } from './enums/oder-status.enum';

@Injectable()
export class OrdersService {
  constructor(
    // Order (Sipariş) tablosu için repository
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    // OrdersProducts (Sipariş Kalemleri / Ara Tablo) için repository
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>
  ) { }

  /**
   * ADIM ADIM SİPARİŞ OLUŞTURMA İŞLEMİ (Create Order)
   * 
   * 1. ADIM: Kargo adresi nesnesi oluştur (new ShippingEntity).
   *    DTO'dan gelen adres verilerini (phone, city, address vs.) kargo nesnesine kopyala.
   * 
   * 2. ADIM: Sipariş nesnesi oluştur (new OrderEntity).
   *    Kargo adresini (shippingAddress) ve siparişi veren kullanıcıyı (user) siparişe bağla.
   * 
   * 3. ADIM: Siparişi kaydediyoruz (orderRepository.save).
   *    cascade: true olduğu için TypeORM kargo adresini de otomatik shippings tablosuna kaydeder
   *    ve bize veritabanında oluşan Sipariş nesnesini (order.id içeren UUID) döndürür.
   * 
   * 4. ADIM: DTO ile gelen ürün listesini (orderedProducts) tek tek geziyoruz (for döngüsü).
   *    Her bir ürün için ara tabloya (orders_products) yazılacak nesneleri hazırlıyoruz:
   *    - Hangi sipariş? (orderId: order.id)
   *    - Hangi ürün? (productId)
   *    - Kaç adet? (product_quantity)
   *    - Birim fiyatı ne kadar? (product_unit_price)
   * 
   * 5. ADIM: Hazırlanan tüm ürün kalemlerini createQueryBuilder ile topluca ara tabloya kaydediyoruz.
   * 
   * 6. ADIM: Oluşturulan siparişi tüm ilişkileriyle (Kargo adresi, Kullanıcı, Ürünler) 
   *    birlikte ekrana döküyoruz (findOne).
   */
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {

    // 1. Kargo Adresi Nesnesini Oluşturuyoruz
    const shippingEntity = new ShippingEntity();
    // DTO'dan gelen verileri (name, phone, address, city...) kargo nesnesine aktarıyoruz
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    // 2. Sipariş Nesnesini Oluşturuyoruz
    const orderEntity = this.orderRepository.create({
      shippingAddress: shippingEntity,// Kargo adresini bağlıyoruz
      user: currentUser,    // Siparişi veren kullanıcıyı bağlıyoruz
    });

    // 3. Siparişi Veritabanına Kaydediyoruz (Sipariş kaydedilince id/UUID oluşur)
    const order = await this.orderRepository.save(orderEntity);

    // 4. Ara Tablo (orders_products) İçin Nesne Dizisi Hazırlıyoruz
    let opEntity: OrdersProductsEntity[] = [];
    for (let i = 0; i < createOrderDto.orderedProducts.length; i++) {
      opEntity.push({
        order: order,
        product: { id: createOrderDto.orderedProducts[i].id } as ProductEntity,
        product_quantity: createOrderDto.orderedProducts[i].product_quantity,
        product_unit_price: createOrderDto.orderedProducts[i].product_unit_price
      } as OrdersProductsEntity);
    }

    // 5. Ara Tabloya (orders_products) Toplu Ekleme Yapıyoruz (Bulk Insert)
    await this.opRepository.createQueryBuilder()
      .insert()
      .into(OrdersProductsEntity)
      .values(opEntity)
      .execute();

    // 6. Siparişi İlişkileriyle Birlikte Getirip Yanıt Olarak Dönüyoruz
    return await this.findOne(order.id);
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true
        }
      }
    });
  }

  async findOne(id: number) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        shippingAddress: true,
        user: true,
        products: {
          product: true
        }
      }
    });

    if (!order) {
      throw new NotFoundException(`Sipariş (#${id}) bulunamadı.`);
    }

    return order;
  }

  /**
   * SİPARİŞ DURUMU GÜNCELLEME (Update Order Status)
   * 
   * @param id Sipariş ID'si
   * @param updateOrderDto Yeni durum bilgisi (SHIPPED, DELIVERED, CANCELLED vs.)
   * @param currentUser Durumu güncelleyen yetkili (Admin)
   */
  async update(id: number, updateOrderDto: UpdateOrderDto, currentUser: UserEntity) {
    // 1. Sipariş var mı kontrol et (yoksa 404 NotFoundException fırlatır)
    const order = await this.findOne(id);

    // 2. Eğer sipariş kargolandıysa (SHIPPED) kargolanma tarihini güncelle
    if (updateOrderDto.status === OrderStatus.SHIPPED && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    // 3. Eğer sipariş teslim edildiyse (DELIVERED) teslim edilme tarihini güncelle
    if (updateOrderDto.status === OrderStatus.DELIVERED && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    // 4. Siparişin yeni durumunu ve güncelleyen Admin bilgisini bağla
    order.status = updateOrderDto.status;
    order.updatedBy = currentUser;

    // 5. Veritabanına kaydet
    return await this.orderRepository.save(order);
  }

  /**
   * SİPARİŞİ VERİTABANINDAN (NEON DB) SİLME (Delete Order)
   * 
   * @param id Silinecek Sipariş ID'si
   */
  async remove(id: number) {
    // 1. Siparişi bul (yoksa 404 atar)
    const order = await this.findOne(id);

    // 2. Neon DB'den fiziki olarak tamamen silmek için .remove() kullanıyoruz
    return await this.orderRepository.remove(order);
  }
}
