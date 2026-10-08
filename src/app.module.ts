import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceOptions } from '../db/data-source';
import { UsersModule } from './users/users.module';
import { CurrentUserMiddleware } from './utility/middlewares/current-user.middleware';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';

@Module({
  imports: [
    // ConfigModule: .env dosyasındaki değişkenleri uygulamanın her yerinde erişilebilir kılar
    ConfigModule.forRoot({ isGlobal: true, }),

    // TypeOrmModule: db/data-source.ts içinde
    // tanımladığımız konfigürasyonu içe aktararak Neon DB bağlantısını kurar
    TypeOrmModule.forRoot(dataSourceOptions),

    UsersModule,

    CategoriesModule,

    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  // Global Middleware Konfigürasyonu:
  // CurrentUserMiddleware'i uygulamanın TÜM rotalarında
  //  (path: "*", tüm HTTP isteklerinde) geçerli kılıyoruz.
  // Böylece gelen her istekte token varsa otomatik doğrulanır ve 
  // kullanıcı req.currentUser'a atanır.
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(CurrentUserMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
