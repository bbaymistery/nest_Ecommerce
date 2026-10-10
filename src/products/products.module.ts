import { forwardRef, Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrdersModule } from 'src/orders/orders.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProductEntity]), // Ürün tablosunu TypeORM'a bağlıyoruz
    CategoriesModule // CategoriesService'i kullanabilmek için CategoriesModule'ü import ediyoruz!
    , forwardRef(() => OrdersModule) // OrdersModule'ü kullanabilmek için forwardRef kullanıyoruz!
  ],
  controllers: [ProductsController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule { }
