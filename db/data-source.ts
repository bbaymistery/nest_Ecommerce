import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';

// .env dosyasındaki değişkenleri yükler (TypeORM CLI komutları için)
config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL, // Neon DB şifreli bağlantı adresi

  // 1. ENTITIES (Tablo Tanımları):
  // Biz TypeScript kodlarımızı src/ klasöründe yazarız (örneğin: src/users/user.entity.ts).
  // Ancak proje çalışırken TypeScript kodları derlenip JavaScript (.js) olarak dist/ klasörüne çıkar.

  // Bu ayar TypeORM'a der ki: "dist/ klasörünün altındaki sonu 
  // .entity.js ile biten TÜM dosyaları bul ve veritabanı tablosu yap."
  entities: ['dist/**/*.entity.js'],

  // 2. MIGRATIONS (Veritabanı Versiyonlama ve Değişiklik Geçmişi):
  migrations: ['dist/db/migrations/*.js'],

  logging: false,
  // Migration kullanırken synchronize false olmalıdır
  synchronize: false,
  ssl: {
    rejectUnauthorized: false, // Neon DB bulut veritabanı için gerekli SSL şifreleme ayarı
  },
};

// TypeORM CLI komutlarının (migration:generate / migration:run) kullandığı ana DataSource örneği
const dataSource = new DataSource(dataSourceOptions);

export default dataSource;

