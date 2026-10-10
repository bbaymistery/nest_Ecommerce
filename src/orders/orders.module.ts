import { forwardRef, Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderEntity } from './entities/order.entity';
import { OrdersProductsEntity } from './entities/orders-products.entity';
import { ShippingEntity } from './entities/shipping.entity';
import { ProductsModule } from 'src/products/products.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrdersProductsEntity,
      ShippingEntity
    ]),
    // forwardRef(() => OrdersModule) yazarak NestJS'e şu talimat verilir:

    // "Acele etme! Önce her iki modülü de başlat. İkisi de yüklendikten sonra bağımlılıklarını birbirine sonradan enjekte et (forward et)."
    forwardRef(() => ProductsModule)
  ],
  controllers: [OrdersController],
  providers: [OrdersService],
  exports: [OrdersService]
})
export class OrdersModule { }
