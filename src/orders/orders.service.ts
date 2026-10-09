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
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class OrdersService {
  constructor(
    // Order (Sipariş) tablosu için repository
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,

    // OrdersProducts (Sipariş Kalemleri / Ara Tablo) için repository
    @InjectRepository(OrdersProductsEntity)
    private readonly opRepository: Repository<OrdersProductsEntity>,

    // Ürünlerin stok durumlarını güncellemek için ProductsService
    private readonly productsService: ProductsService,
  ) { }

  /**
   * ADIM ADIM SİPARİŞ OLUŞTURMA İŞLEMİ (Create Order)
   */
  async create(createOrderDto: CreateOrderDto, currentUser: UserEntity) {

    // 1. Kargo Adresi Nesnesini Oluşturuyoruz
    const shippingEntity = new ShippingEntity();
    Object.assign(shippingEntity, createOrderDto.shippingAddress);

    // 2. Sipariş Nesnesini Oluşturuyoruz
    const orderEntity = this.orderRepository.create({
      shippingAddress: shippingEntity,
      user: currentUser,
    });

    // 3. Siparişi Veritabanına Kaydediyoruz
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

    // 5. Ara Tabloya (orders_products) Toplu Ekleme Yapıyoruz
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
   * STOK GÜNCELLEME YARDIMCI METODU (Stock Update Helper)
   * 
   * Sipariş içerisindeki tüm ürünleri tek tek gezip ürünlerin veritabanındaki 
   * stok miktarlarını duruma göre (DELIVERED / CANCELLED) günceller.
   */
  async stockUpdate(order: OrderEntity, status: string) {
    for (const op of order.products) {
      await this.productsService.updateStock(
        op.product.id,
        op.product_quantity,
        status,
      );
    }
  }

  /**
   * SİPARİŞ DURUMU GÜNCELLEME (Update Order Status)
   */
  async update(id: number, updateOrderDto: UpdateOrderDto, currentUser: UserEntity) {
    let order = await this.findOne(id);

    if (updateOrderDto.status === OrderStatus.SHIPPED && !order.shippedAt) {
      order.shippedAt = new Date();
    }

    if (updateOrderDto.status === OrderStatus.DELIVERED && !order.deliveredAt) {
      order.deliveredAt = new Date();
    }

    order.status = updateOrderDto.status;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    // Eğer sipariş teslim edildiyse (DELIVERED), stok miktarlarını düşür
    if (updateOrderDto.status === OrderStatus.DELIVERED) {
      await this.stockUpdate(order, OrderStatus.DELIVERED);
    }

    return order;
  }

  /**
   * SİPARİŞİ İPTAL ETME (Cancel Order)
   * 
   * Siparişi CANCELLED durumuna getirir ve ürün stoklarını iade eder (stokları arttırır).
   */
  async cancelled(id: number, currentUser: UserEntity) {
    let order = await this.findOne(id);

    if (!order) {
      throw new NotFoundException('Order Not Found.');
    }

    // Eğer sipariş zaten iptal edilmişse aynı işlemi tekrar yapma
    if (order.status === OrderStatus.CANCELLED) {
      return order;
    }

    order.status = OrderStatus.CANCELLED;
    order.updatedBy = currentUser;
    order = await this.orderRepository.save(order);

    // İptal edildiği için ürün stoklarını veritabanında geri arttırıyoruz (iade ediyoruz)
    await this.stockUpdate(order, OrderStatus.CANCELLED);

    return order;
  }

  /**
   * SİPARİŞİ VERİTABANINDAN (NEON DB) SİLME (Delete Order)
   */
  async remove(id: number) {
    const order = await this.findOne(id);
    return await this.orderRepository.remove(order);
  }
}
