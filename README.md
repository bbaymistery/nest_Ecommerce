# 🛒 NestJS E-Ticaret Backend REST API — Detaylı Geliştirme ve Metod Rehberi

Bu belge, NestJS, TypeORM ve PostgreSQL (Neon Cloud Database) kullanılarak geliştirilen e-ticaret arka plan uygulamasının **kronolojik geliştirme sırasını, tüm modüllerini, servis metodlarını, HTTP route'larını ve mimari kararlarını** eksiksiz ve detaylı biçimde açıklamak amacıyla hazırlanmıştır.

---

## 📋 İÇİNDEKİLER

1. [Proje Mimarisi ve Teknoloji Yığını](#1-proje-mimarisi-ve-teknoloji-yığını)
2. [Veritabanı Şeması ve İlişki Haritası](#2-veritabanı-şeması-ve-ilişki-haritası)
3. [Adım Adım Kronolojik Geliştirme Akışı](#3-adım-adım-kronolojik-geliştirme-akışı)
   - [Adım 1: Kullanıcı Yönetimi ve Kimlik Doğrulama (Users & Auth)](#adım-1-kullanıcı-yönetimi-ve-kimlik-doğrulama-users--auth)
   - [Adım 2: Kategori Yönetimi (Categories)](#adım-2-kategori-yönetimi-categories)
   - [Adım 3: Ürün Yönetimi ve Karmaşık Sorgular (Products)](#adım-3-ürün-yönetimi-ve-karmaşık-sorgular-products)
   - [Adım 4: Ürün Yorumları ve Puanlama (Reviews)](#adım-4-ürün-yorumları-ve-puanlama-reviews)
   - [Adım 5: Sipariş, Kargo ve Stok Yönetimi (Orders & Shipping)](#adım-5-sipariş-kargo-ve-stok-yönetimi-orders--shipping)
4. [Yardımcı Mekanizmalar (Guards, Decorators, Interceptors)](#4-yardımcı-mekanizmalar-guards-decorators-interceptors)
5. [İleri Düzey Mimari Çözümler](#5-i̇leri-düzey-mimari-çözümler)
6. [Kurulum ve Çalıştırma Rehberi](#6-kurulum-ve-çalıştırma-rehberi)

---

## 1. PROJE MİMARİSİ VE TEKNOLOJİ YIĞINI

* **Çerçeve (Framework):** NestJS (TypeScript tabanlı Node.js framework'ü)
* **Veritabanı:** PostgreSQL (Neon DB Bulut Veritabanı)
* **ORM:** TypeORM & TypeORM CLI (Migration yönetimi için)
* **Güvenlik & Şifreleme:** JWT (JSON Web Token), bcryptjs
* **Veri Dönüştürme & Süzme:** `class-transformer` & `class-validator`
* **Asenkron Akışlar:** RxJS (Interceptor veri manipülasyonu için)

---

## 2. VERİTABANI ŞEMASI VE İLİŞKİ HARİTASI

Uygulamada yer alan tablolar ve aralarındaki ilişkiler aşağıdaki gibidir:

```mermaid
erDiagram
    UserEntity ||--o{ ProductEntity : "ekler (addedBy)"
    UserEntity ||--o{ OrderEntity : "verir (user)"
    UserEntity ||--o{ ReviewEntity : "yazar (user)"
    CategoryEntity ||--o{ ProductEntity : "içerir (category)"
    ProductEntity ||--o{ ReviewEntity : "alır (reviews)"
    ProductEntity ||--o{ OrdersProductsEntity : "yer alır (product)"
    OrderEntity ||--|{ OrdersProductsEntity : "kalemleri (products)"
    OrderEntity ||--|| ShippingEntity : "kargo adresi (shippingAddress)"
```

* **Users <-> Products (`1-to-N`):** Bir yetkili (Admin) birden fazla ürün ekleyebilir.
* **Users <-> Orders (`1-to-N`):** Bir kullanıcı birden fazla sipariş verebilir.
* **Categories <-> Products (`1-to-N`):** Bir kategoriye birden fazla ürün bağlanabilir.
* **Products <-> Reviews (`1-to-N`):** Bir ürün için birden fazla değerlendirme yapılabilir.
* **Orders <-> Shipping (`1-to-1`):** Bir siparişin tek bir teslimat kargo adresi vardır (`cascade: true`).
* **Orders <-> Products (`N-to-N`):** Sipariş ve Ürün arasındaki ilişki `OrdersProductsEntity` (Ara / Pivot Tablo) üzerinden kurulur.

---

## 3. ADIM ADIM KRONOLOJİK GELİŞTİRME AKIŞI

Proje geliştirilirken bağımlılık sırasına dikkat edilerek aşağıdaki modüler sıra izlenmiştir:

---

### Adım 1: Kullanıcı Yönetimi ve Kimlik Doğrulama (`UsersModule`)

Sistemin temelini oluşturan kullanıcı kaydı, girişi ve JWT token yönetimi ilk aşamada inşa edildi.

#### 📁 Veritabanı Tablosu (`UserEntity`)
* `id`: Otomatik artan birincil anahtar.
* `name`, `email`: Kullanıcı bilgileri (email unique).
* `password`: bcryptjs ile hash'lenmiş şifre.
* `roles`: Kullanıcı yetki türü (`ADMIN`, `USER`).

#### 🛠️ Servis Metodları (`UsersService`)

1. **`signup(createUserDto: UserCreateDto): Promise<UserEntity>`**
   * **İşlevi:** Yeni kullanıcı kaydı oluşturur.
   * **Mantığı:** Gelen e-posta adresinin veritabanında daha önce var olup olmadığını kontrol eder. Yoksa `bcrypt.hash(password, 10)` ile şifreyi kriptolayıp kaydeder.

2. **`signin(userSignInDto: UserSignInDto): Promise<UserEntity>`**
   * **İşlevi:** Kullanıcı girişini doğrular.
   * **Mantığı:** E-posta adresiyle kullanıcıyı arar (`select: +password`). Şifreyi `bcrypt.compare` ile doğrular. Hata yoksa kullanıcı bilgilerini döner.

3. **`accessToken(user: UserEntity): string`**
   * **İşlevi:** Giriş yapan kullanıcı için JWT erişim anahtarı (token) üretir.
   * **Mantığı:** `jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET)` çağrısı ile token oluşturur.

4. **`findAll(): Promise<UserEntity[]>`**
   * **İşlevi:** Sistemdeki tüm kullanıcıları listeler (Admin özel).

5. **`findOne(id: number): Promise<UserEntity>`**
   * **İşlevi:** ID'ye göre tek bir kullanıcının detayını getirir.

#### 🌐 Controller Endpoint'leri (`UsersController`)

* `POST /users/signup` -> Yeni kullanıcı kaydı (`signup`).
* `POST /users/signin` -> Kullanıcı girişi ve JWT token alma (`signin`).
* `GET /users/me` -> `@UseGuards(AuthenticationGuard)` -> O anki giriş yapmış kullanıcının profilini getirir.
* `GET /users/all` -> `@UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))` -> Tüm kullanıcıları listeler.
* `GET /users/single/:id` -> ID ile kullanıcı detayını getirir.

---

### Adım 2: Kategori Yönetimi (`CategoriesModule`)

Ürünleri gruplamak için gerekli kategori yapısı inşa edildi.

#### 📁 Veritabanı Tablosu (`CategoryEntity`)
* `id`: Birincil anahtar.
* `title`, `description`: Kategori adı ve açıklaması.
* `addedBy`: Kategoriyi oluşturan yetkili kullanıcı (`@ManyToOne -> UserEntity`).

#### 🛠️ Servis Metodları (`CategoriesService`)

1. **`create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<CategoryEntity>`**
   * **İşlevi:** Yeni bir kategori ekler.
   * **Mantığı:** DTO verisini alır ve `addedBy` alanına isteği atan admin kullanıcısını (`currentUser`) bağlayarak kaydeder.

2. **`findAll(): Promise<CategoryEntity[]>`**
   * **İşlevi:** Sistemdeki tüm kategorileri `addedBy` ilişkisiyle birlikte getirir.

3. **`findOne(id: number): Promise<CategoryEntity>`**
   * **İşlevi:** ID'si verilen kategoriyi bulur; yoksa `NotFoundException` atar.

4. **`update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity>`**
   * **İşlevi:** Mevcut bir kategorinin bilgilerini günceller.

5. **`remove(id: number): Promise<CategoryEntity>`**
   * **İşlevi:** Kategoriyi veritabanından siler.

#### 🌐 Controller Endpoint'leri (`CategoriesController`)

* `POST /categories` -> `@UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))` -> Kategori ekleme.
* `GET /categories` -> Tüm kategorileri listeleme (Herkese açık).
* `GET /categories/:id` -> Kategori detayı.
* `PATCH /categories/:id` -> `@UseGuards(...)` -> Kategori güncelleme (Admin).
* `DELETE /categories/:id` -> `@UseGuards(...)` -> Kategori silme (Admin).

---

### Adım 3: Ürün Yönetimi ve Karmaşık Sorgular (`ProductsModule`)

Projenin kalbi olan ürün yönetimi; arama, sayfalama, puan ortalaması hesaplama ve gelişmiş filtreleme mekanizmalarıyla yazıldı.

#### 📁 Veritabanı Tablosu (`ProductEntity`)
* `id`, `title`, `description`, `price`, `stock`, `images`: Ürün temel bilgileri.
* `category`: Bağlı olduğu kategori (`CategoryEntity`).
* `addedBy`: Ekleyen yetkili (`UserEntity`).
* `reviews`: Ürüne yapılan yorumlar (`ReviewEntity[]`).

#### 🛠️ Servis Metodları (`ProductsService`)

1. **`create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity>`**
   * **İşlevi:** Yeni ürün oluşturur.
   * **Mantığı:** `CategoriesService.findOne` ile kategorinin varlığını doğrular. Ürüne kategorisini ve ekleyen yetkiliyi bağlayıp kaydeder.

2. **`findAll(query: FilterProductDto): Promise<{ products: object[], totalProducts: number, limit: number }>`**
   * **İşlevi:** Gelişmiş filtreleme, sayfalama ve dinamik SQL hesaplamalarıyla ürünleri getirir.
   * **Mantığı (QueryBuilder):**
     - `leftJoinAndSelect('products.category', 'category')` ile kategori bilgilerini birleştirir.
     - `leftJoin('products.reviews', 'review')` ile yorumları bağlar.
     - `addSelect(['COUNT(review.id) AS reviewCount', 'AVG(review.ratings)::numeric(10,2) AS avgRating'])` ile ürünlerin puan ortalamasını ve yorum sayısını hesaplar.
     - `groupBy('products.id, category.id')` ile sonuçları gruplar (PostgreSQL kuralı).
     - **Filtreler:**
       - `search`: `products.title LIKE %search%` arama filtresi.
       - `category`: Kategoriye göre süzme.
       - `minPrice / maxPrice`: Fiyat aralığı süzmesi.
       - `minRating / maxRating`: `andHaving('AVG(review.ratings) >= :minRating')` ile puan süzmesi.
     - `limit` ve `offset` ile sayfalama (pagination) yapar.
     - `getRawMany()` ile ham SQL verisi döner.

3. **`findOne(id: number): Promise<ProductEntity>`**
   * **İşlevi:** Ürün detayını kategorisi ve ekleyen kullanıcısıyla birlikte getirir. Yoksa 404 atar.

4. **`update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity>`**
   * **İşlevi:** Ürün bilgilerini ve gerekirse kategorisini günceller.

5. **`remove(id: number): Promise<ProductEntity>`**
   * **İşlevi:** Ürünü güvenli şekilde siler.
   * **İş Kuralı:** `OrdersService.findOneByProductId(product.id)` çağrılarak bu ürünün siparişi var mı kontrol edilir. Eğer varsa `BadRequestException("Product is in use")` hatası vererek veritabanı bütünlüğünü korur.

6. **`updateStock(id: number, stockQuantity: number, status: string)`**
   * **İşlevi:** Sipariş durumlarına göre ürün stoklarını güncelleyen yardımcı metottur.
   * **Mantığı:** `status === 'delivered'` ise stok düşer (`stock -= stockQuantity`), `cancelled` ise stok iade edilir (`stock += stockQuantity`).

#### 🌐 Controller Endpoint'leri (`ProductsController`)

* `POST /products/create` -> `@UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))` -> Ürün ekleme.
* `GET /products/all` -> `@SerializeIncludes(ProductDto)` -> Filtreli ürün listeleme (Serialization interceptor ile süzülür).
* `GET /products/:id` -> Ürün detayı.
* `PATCH /products/:id` -> Admin ürün güncelleme.
* `DELETE /products/:id` -> Admin ürün silme.

---

### Adım 4: Ürün Yorumları ve Puanlama (`ReviewsModule`)

Kullanıcıların ürünlere puan (1-5 yıldız) vermesini ve yorum yazmasını sağlayan modüldür.

#### 📁 Veritabanı Tablosu (`ReviewEntity`)
* `id`, `ratings` (1-5 sayı), `comment` (yorum metni).
* `user`: Yorumu yazan müşteri (`UserEntity`).
* `product`: Yorum yapılan ürün (`ProductEntity`).

#### 🛠️ Servis Metodları (`ReviewsService`)

1. **`create(createReviewDto: CreateReviewDto, currentUser: UserEntity): Promise<ReviewEntity>`**
   * **İşlevi:** Bir ürüne yeni yorum ve puan ekler.
   * **Mantığı:** `ProductsService.findOne` ile ürünün varlığını kontrol eder, yazar kullanıcıyı bağlar ve kaydeder.

2. **`findAll(): Promise<ReviewEntity[]>`**
   * **İşlevi:** Sistemdeki tüm yorumları listeler.

3. **`findAllByProduct(productId: number): Promise<ReviewEntity[]>`**
   * **İşlevi:** Belirli bir ürüne ait yapılan tüm yorumları yazar bilgisiyle getirir.

4. **`findOne(id: number): Promise<ReviewEntity>`**
   * **İşlevi:** Yorum detayını getirir.

5. **`remove(id: number): Promise<ReviewEntity>`**
   * **İşlevi:** Yorumu veritabanından siler.

#### 🌐 Controller Endpoint'leri (`ReviewsController`)

* `POST /reviews` -> `@UseGuards(AuthenticationGuard)` -> Kullanıcının yorum yapması.
* `GET /reviews` -> Tüm yorumlar.
* `GET /reviews/by-product/:productId` -> Ürünün yorumlarını getirme.
* `DELETE /reviews/:id` -> Admin yorum silme.

---

### Adım 5: Sipariş, Kargo ve Stok Yönetimi (`OrdersModule`)

E-ticaretin alışveriş tamamlama, kargo adresi kaydı ve stok düşme süreçleri inşa edildi.

#### 📁 Veritabanı Tabloları
1. **`OrderEntity`:** Sipariş ana tablosu (`status`, `orderAt`, `shippedAt`, `deliveredAt`, `user`, `updatedBy`).
2. **`ShippingEntity`:** Kargo teslimat adresi bilgileri (`address`, `city`, `phone`, `country`, `order`).
3. **`OrdersProductsEntity` (Ara Tablo):** Sipariş edilen ürünler, satın alma tarihindeki birim fiyat (`product_unit_price`) ve adet (`product_quantity`).

#### 🛠️ Servis Metodları (`OrdersService`)

1. **`create(createOrderDto: CreateOrderDto, currentUser: UserEntity): Promise<OrderEntity>`**
   * **İşlevi:** Adım adım yeni bir sipariş oluşturur.
   * **Mantığı:**
     - 1. DTO'daki teslimat bilgilerinden `ShippingEntity` nesnesi oluşturur.
     - 2. `OrderEntity` nesnesini oluşturup kullanıcıyı bağlar ve kaydeder.
     - 3. Siparişteki ürün dizisini döngüyle gezip `OrdersProductsEntity` kalemlerini hazırlar.
     - 4. `opRepository.createQueryBuilder().insert().into(OrdersProductsEntity)` ile toplu kayıt (bulk insert) yapar.

2. **`findAll(): Promise<OrderEntity[]>`**
   * **İşlevi:** Tüm siparişleri kargo adresi, siparişi veren kullanıcı ve sipariş edilen ürün detaylarıyla birlikte getirir.

3. **`findOne(id: number): Promise<OrderEntity>`**
   * **İşlevi:** ID'ye göre siparişin tüm detaylarını getirir.

4. **`update(id: number, updateOrderDto: UpdateOrderDto, currentUser: UserEntity): Promise<OrderEntity>`**
   * **İşlevi:** Admin tarafından sipariş durumunu (`PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`) günceller.
   * **Mantığı:** Durum `DELIVERED` veya `CANCELLED` olarak değişirse `stockUpdate(order, status)` çağrılarak ürün stokları otomatik güncellenir. Güncelleyen admin kaydedilir.

5. **`cancelled(id: number, currentUser: UserEntity): Promise<OrderEntity>`**
   * **İşlevi:** Müşteri veya admin tarafından siparişin iptal edilmesini sağlar.
   * **Mantığı:** Sipariş zaten teslim edilmediyse durumu `CANCELLED` yapar ve `stockUpdate` çağırıp stokları ürüne iade eder.

6. **`stockUpdate(order: OrderEntity, status: string)`**
   * **İşlevi:** Sipariş içindeki ürünleri döngüyle gezip `ProductsService.updateStock` metodunu çalıştıran yardımcı fonksiyondur.

7. **`findOneByProductId(productId: number): Promise<OrdersProductsEntity>`**
   * **İşlevi:** Ürün silinmek istendiğinde `ProductsService.remove` tarafından çağrılır. `OrdersProducts` tablosunda o `productId` ile verilmiş bir sipariş var mı diye kontrol eder.

#### 🌐 Controller Endpoint'leri (`OrdersController`)

* `POST /orders` -> `@UseGuards(AuthenticationGuard)` -> Sipariş verme.
* `GET /orders` -> `@UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))` -> Tüm siparişler (Admin).
* `GET /orders/:id` -> Sipariş detayı.
* `PUT /orders/update-status/:id` -> Admin sipariş durumu güncelleme (Kargolandı/Teslim Edildi).
* `PUT /orders/cancel/:id` -> Sipariş iptal etme.

---

## 4. YARDIMCI MEKANİZMALAR (GUARDS, DECORATORS, INTERCEPTORS)

### 🛡️ Guards (Güvenlik Kalkanları)
1. **`AuthenticationGuard` (`src/utility/guards/authentication.guard.ts`):**  
   HTTP başlığındaki `Authorization: Bearer <token>` ifadesinden JWT token'ı alır, `jsonwebtoken.verify` ile çözer ve kullanıcıyı isteğe (`request.currentUser`) bağlar.
2. **`AuthorizeGuard` (`src/utility/guards/authorization.guard.ts`):**  
   Rol kontrolü yapar. Örneğin `AuthorizeGuard(Roles.ADMIN)` verilen bir route'a sadece `roles === 'admin'` olan kullanıcıların girmesine izin verir.

### 🎨 Custom Decorators
1. **`@CurrentUser()` (`src/utility/decorators/current-user.decorator.ts`):**  
   Controller metodlarında `request.currentUser` nesnesini parametre olarak doğrudan almanızı sağlar.
2. **`@SerializeIncludes(dto)`:**  
   Response süzme interceptor'ını pratik şekilde controller metoduna bağlar.

### 🔄 Interceptors & Response Serialization
1. **`SerializeInterceptor` (`src/utility/interceptors/serialize.interceptor.ts`):**  
   RxJS `pipe` ve `map` kullanarak cevabı yakalar. `plainToClass(this.dto, data, { excludeExtraneousValues: true })` komutuyla DTO'da `@Expose()` almamış tüm gereksiz SQL alanlarını süzerek istemciye temiz veri döner.
2. **`ProductDto` & `ProductList` (`src/products/dto/products.dto.ts`):**  
   Veritabanından ham gelen `products_id`, `category_title`, `reviewcount` gibi SQL alanlarını `@Expose({ name: 'products_id' })` ve `@Transform` ile istemciye uygun temiz nesne formatına çevirir:
   ```json
   {
     "id": 3,
     "title": "Home Eşyası",
     "price": "22.00",
     "images": ["img1.png", "img2.png"],
     "category": { "id": 8, "title": "Home" },
     "review": "1",
     "rating": "4.00"
   }
   ```

---

## 5. İLERİ DÜZEY MİMARİ ÇÖZÜMLER

### 🔄 Dairesel Bağımlılık (Circular Dependency) Çözümü
`ProductsModule` (ürün silerken sipariş kontrolü yapmak için) `OrdersModule`'e; `OrdersModule` ise (stok güncellemek için) `ProductsModule`'e bağımlıdır.

Bu dairesel bağımlılık **`forwardRef()`** ile çözülmüştür:

```typescript
// products.module.ts & orders.module.ts
imports: [forwardRef(() => OrdersModule)]

// products.service.ts & orders.service.ts constructor:
constructor(
  @Inject(forwardRef(() => OrdersService))
  private readonly ordersService: OrdersService,
) {}
```

---

## 6. KURULUM VE ÇALIŞTIRMA REHBERİ

### 1. Proje Bağımlılıklarını Yükleyin
```bash
npm install
```

### 2. Çevre Değişkenlerini (`.env`) Yapılandırın
Kök dizinde `.env` dosyası oluşturun:
```env
PORT=3000
DATABASE_URL=postgres://kullanici:sifre@ep-xyz.neon.tech/neondb?sslmode=require
JWT_SECRET=super_secret_jwt_key
JWT_EXPIRES_IN=1d
```

### 3. Geliştirici Sunucusunu Başlatın
```bash
npm run start:dev
```

### 4. TypeORM Migration Komutları
```bash
# Otomatik Migration Dosyası Oluşturma
npm run typeorm migration:generate src/db/migrations/InitSchema

# Migration'ları Veritabanına Uygulama
npm run typeorm migration:run
```
