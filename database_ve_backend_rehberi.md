# 🗺️ Veritabanı ve Backend Teknolojileri Rehberi

Bu rehber, backend dünyasındaki karmaşık görünen kavramları (**Supabase, Neon, Firebase, MongoDB, Prisma, TypeORM**) zihninde netleştirmek ve doğru projede doğru teknolojiyi seçebilmeni sağlamak için hazırlanmıştır.

---

## 💡 1. Büyük Resim (Bütün Katmanlar Tek Bakışta)

Kafanın karışmasının sebebi, farklı kategorideki araçların aynı çuvala konulmasıdır. Aşağıdaki harita tüm bu araçların **ne olduğunu** gösterir:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        SENİN UYGULAMAN (Frontend / Mobile)             │
└──────────────────────────────────┬─────────────────────────────────────┘
       ▼                                                       ▼
┌──────────────────────────────────────┐     ┌──────────────────────────────────┐
│  A) Kendi Backend'ini Yazıyorsan     │     │  B) Hazır Backend Kullanıyorsan  │
│     (NestJS, Express, Next.js)       │     │     (BaaS - Backend as a Service)│
└──────────────────┬───────────────────┘     └─────────────────┬────────────────┘
                   │                                           │
         ┌─────────┴─────────┐                       ┌─────────┴─────────┐
         ▼                   ▼                       ▼                   ▼
    ┌─────────┐         ┌─────────┐             ┌───────────┐       ┌───────────┐
    │   ORM   │         │   ORM   │             │ Supabase  │       │ Firebase  │
    │ (Prisma │         │(TypeORM)│             │ (Postgres)│       │  (NoSQL)  │
    └────┬────┘         └────┬────┘             └─────┬─────┘       └─────┬─────┘
         │                   │                        │                   │
         └─────────┬─────────┘                        │                   │
                   ▼                                  │                   │
  ┌─────────────────────────────────┐                 │                   │
  │     GERÇEK VERİTABANI (Database) │◄────────────────┘                   │
  │  PostgreSQL / Neon / MongoDB    │◄────────────────────────────────────┘
  └─────────────────────────────────┘
```

---

## 🏢 2. Benzetme ile Anlayalım: "Ev İnşa Etmek"

* **Veritabanı (PostgreSQL, MongoDB, Neon)**: Evin **arsası ve temel betonudur**. Verilerin kalıcı olarak saklandığı yerdir.
* **ORM (Prisma, TypeORM, Mongoose)**: Arsayı kullanmanı kolaylaştıran **vinç ve iş makineleridir**. Veritabanı DEĞİLDİR, kod yazarken SQL cümleleri yazmak yerine JavaScript/TypeScript nesneleriyle çalışmanı sağlar.
* **BaaS (Supabase, Firebase)**: **Hazır, mobilyalı prefabrik evdir**. İçinde veritabanı, güvenlik kapısı (Auth), deposu (Storage) ve elektrik tesisatı (Realtime API) kurulu gelir. Sıfırdan backend yazmak istemiyorsan bunu alıp direkt yaşamaya (frontend bağlamaya) başlarsın.

---

## 🧩 3. Teknolojilerin Detaylı Tanımları

### 1. Supabase Nedir?
* **Kategori**: BaaS (Backend as a Service) - Açık Kaynak Firebase Alternatifi.
* **Arka Planda Ne Var?**: %100 açık kaynaklı **PostgreSQL** veritabanı üzerine kuruludur.
* **Sana Ne Sağlar?**:
  1. PostgreSQL Veritabanı
  2. Kullanıcı Giriş/Kayıt Sistemi (Authentication - OAuth, Google, Email/Password)
  3. Dosya Depolama (Storage - Resim, video saklama)
  4. Realtime API (Veritabanı değiştiğinde canlı bildirim alma)
  5. Auto-generated REST & GraphQL API
* **Hangi Şirketler Neden Kullanır?**:
  * **Kullananlar**: Mobbin, Mozilla destekli startup'lar, 1000'lerce SaaS ve AI girişimci şirket.
  * **Neden?**: 1 ayda yazılacak auth, storage ve veritabanı altyapısını 5 dakikada kurarlar. Ayrıca Firebase gibi Google'a bağımlı olmak istemeyen, SQL gücü arayanlar seçer.

---

### 2. Neon Database Nedir?
* **Kategori**: Serverless PostgreSQL Database.
* **Supabase'den Farkı**: Supabase sana Auth, Storage vs. verir. Neon ise **SADECE VERİTABANIDIR**.
* **Özel Gücü (Neden Popüler?)**:
  * **Serverless**: Kullanmadığında uyur (fatura yazmaz), istek geldiğinde milisaniyeler içinde uyanır.
  * **Database Branching**: Git'te nasıl `git branch feature-x` açıyorsan, Neon'da veritabanının birebir kopyasını 1 saniyede branch olarak açıp test edebilirsin!
* **Hangi Şirketler Neden Kullanır?**:
  * **Kullananlar**: Vercel (Vercel Postgres altyapısı Neon'dur), Replit, Retool.
  * **Neden?**: Next.js / Serverless mimari kullanan şirketler, sunucu yönetmekle uğraşmadan ölçeklenebilir PostgreSQL elde etmek için Neon kullanır.

---

### 3. Firebase Nedir?
* **Kategori**: BaaS (Backend as a Service) - Google Ekosistemi.
* **Arka Planda Ne Var?**: NoSQL tabanlı **Firestore** veya **Realtime Database**.
* **Supabase vs Firebase**:
  * Supabase = **PostgreSQL (İlişkisel/SQL)** tabanlıdır.
  * Firebase = **Firestore (Doküman tabanlı/NoSQL)** tabanlıdır.
* **Hangi Şirketler Neden Kullanır?**:
  * **Kullananlar**: Duolingo, Lyft, Alibaba, Shazam.
  * **Neden?**: Mobil (Flutter/React Native/iOS/Android) uygulamalarda canlı senkronizasyon (push notification, anlık mesajlaşma) inanılmaz kolaydır.

---

### 4. MongoDB Nedir?
* **Kategori**: NoSQL (Doküman Tabanlı) Veritabanı.
* **PostgreSQL / SQL'den Farkı**:
  * SQL'de tablolar ve sütunlar vardır (`users` tablosu -> `id`, `name`, `email`). Her satır aynı yapıya uymak zorundadır.
  * MongoDB'de veriler **JSON objesi** (BSON) şeklinde saklanır. Esnektir, her dokümanın alanı farklı olabilir.
* **Hangi Şirketler Neden Kullanır?**:
  * **Kullananlar**: Forbes, Toyota, eBay, SEGA.
  * **Neden?**: Şeması sürekli değişen ürün katalogları, e-ticaret sepetleri, log kayıtları, esnek analitik verileri için mükemmeldir.

---

### 5. Prisma ve TypeORM Nedir? (PrismaTypeorm Bir Supabase Mi?)
* **Cevap: KESİNLİKLE HAYIR!**
* **Prisma & TypeORM**: Veritabanı veya BaaS değildir! Bunlar **ORM (Object-Relational Mapper)** kütüphaneleridir.
* **Ne Yaparlar?**:
  * Sen NestJS veya Node.js tarafında `SELECT * FROM users WHERE id = 5` yazmak yerine `prisma.user.findUnique({ where: { id: 5 } })` yazarsın.
  * Otomatik TypeScript türleri (type safety) sunarlar.
* **Karşılaştırma**:
  * **TypeORM**: Klasik Class & Decorator desenini sever (`@Entity()`, `@Column()`). NestJS ile çok yaygın kullanılır.
  * **Prisma**: Kendi `.schema` dosyasını kullanır, type-safety konusunda günümüzün en popüler tercihidir.

---

## 📊 4. Özet Karşılaştırma Tablosu

| Araç           | Kategorisi         | Veritabanı mı? | SQL mi NoSQL mi?  | Hangi Katmanda Çalışır?        |
| :------------- | :----------------- | :------------- | :---------------- | :----------------------------- |
| **PostgreSQL** | Veritabanı         | **EVET**       | SQL (İlişkisel)   | Veri Saklama Katmanı           |
| **MongoDB**    | Veritabanı         | **EVET**       | NoSQL (Doküman)   | Veri Saklama Katmanı           |
| **Neon DB**    | Serverless DB      | **EVET**       | SQL (PostgreSQL)  | Bulut Veri Saklama             |
| **Supabase**   | BaaS (Tüm Altyapı) | **İçinde var** | SQL (PostgreSQL)  | Full Backend (DB+Auth+Storage) |
| **Firebase**   | BaaS (Tüm Altyapı) | **İçinde var** | NoSQL (Firestore) | Full Backend (DB+Auth+Storage) |
| **Prisma**     | ORM Kütüphanesi    | **HAYIR**      | İkisini de bağlar | Node.js / NestJS Kodu İçi      |
| **TypeORM**    | ORM Kütüphanesi    | **HAYIR**      | SQL Bağlar        | Node.js / NestJS Kodu İçi      |

---

## 🛠️ 5. Gerçek Proje Senaryoları (Hangi Projede Hangisini Seçmelisin?)

### 🎯 Senaryo A: NestJS ile Kurumsal E-Ticaret / Finans Backend'i
* **İhtiyaç**: Güçlü ilişkisel veriler (Siparişler, Kullanıcılar, Ödemeler, Stok kontrolü), ACID garantisi.
* **Doğru Mimari**: **NestJS + TypeORM (veya Prisma) + PostgreSQL (Neon veya Kendi Docker Postgres'in)**.
* **Neden Supabase Değil?**: Çünkü tüm iş mantığını (business logic), ödeme entegrasyonlarını ve özel servisleri NestJS içinde yazmak istiyorsun. Veritabanı olarak Neon DB veya Postgres kullanıp Prisma/TypeORM ile erişirsin.

### 🎯 Senaryo B: Hızlıca Tek Başına Bir SaaS / Mobil Uygulama Çıkaracaksın (MVP)
* **İhtiyaç**: Zamanın az, backend yazmakla (Auth, JWT, Refresh Token, S3 dosya yükleme) 3 ay harcamak istemiyorsun.
* **Doğru Mimari**: **Next.js / React Native + Supabase**.
* **Neden?**: Supabase dashboard'undan 1 dakikada auth açarsın, resim yükleme bucket'ı kurarsın ve direkt Next.js/React içinden veritabanına bağlanırsın.

### 🎯 Senaryo C: Canlı Chat / Anlık Bildirim Ağırlıklı Mobil Uygulama
* **İhtiyaç**: Kullanıcılar anlık mesajlaşsın, online olanları görelim, push notification gitsin.
* **Doğru Mimari**: **Flutter / React Native + Firebase**.
* **Neden?**: Firebase Firestore realtime dinleyicileri (listeners) mobil cihazlarda pil ve ağ dostu olarak harika çalışır.

### 🎯 Senaryo D: Esnek Ürün Kataloğu ve Log Analiz Sistemi
* **İhtiyaç**: Ayakkabı satıyorsun ama her ayakkabının niteliği farklı (biri numara, biri renk, biri materyal, diğeri garanti süresi). Sabit SQL şeması zorluyor.
* **Doğru Mimari**: **Node.js + Mongoose + MongoDB**.
* **Neden?**: Esnek JSON saklama yeteneği sayesinde her ürüne farklı alanlar ekleyebilirsin.

---

## 🧘‍♂️ 6. Kafanı Rahatlatacak 3 Altın Kurul

1. **"ORM" ve "Veritabanı" aynı şey değildir.** (Prisma/TypeORM bir kütüphanedir, veriyi saklayan PostgreSQL/MongoDB'dir).
2. **"BaaS (Supabase/Firebase)" sıfırdan backend yazma yükünü kaldırır.** Kendi NestJS sunucunu yazıyorsan genellikle Supabase'in auth'una muhtaç değilsin, doğrudan veritabanı (Neon / Postgres) + ORM (Prisma/TypeORM) kullanırsın.
3. **Hiçbir teknoloji diğerini yok etmez.** Doğru araç, doğru projenin ihtiyacına göre seçilir.
