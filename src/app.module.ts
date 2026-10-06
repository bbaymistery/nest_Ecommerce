import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    // 1. ConfigModule: .env dosyasındaki değişkenleri (örneğin DATABASE_URL) okumamızı sağlar.
    // isGlobal: true yaparak tüm projede (her modülde) erişilebilir hale getiriyoruz.
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. TypeOrmModule: NestJS ile PostgreSQL veritabanımız (Neon DB) arasındaki ana bağlantıyı kurar.
    TypeOrmModule.forRoot({
      type: 'postgres', // Veritabanı türümüz PostgreSQL
      url: process.env.DATABASE_URL, // .env dosyasından okunan Neon DB bağlantı adresimiz
      autoLoadEntities: true, // Projede oluşturacağımız tüm @Entity (tablo) sınıflarını otomatik bulur ve yükler
      synchronize: true, // Geliştirme ortamında TypeScript sınıflarımıza göre veritabanı tablolarını OTOMATİK oluşturur
      ssl: {
        rejectUnauthorized: false, // Neon DB gibi bulut veritabanları SSL gerektirir, şifreli güvenli bağlantıyı sağlar
      },
    }),
  ],
  controllers: [AppController], // Uygulamanın HTTP isteklerini (GET, POST) karşılayan controller sınıfları
  providers: [AppService], // İş mantığının (business logic) yazıldığı servis sınıfları
})
export class AppModule {}
