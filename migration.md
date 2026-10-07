# TypeORM Migration (Veritabanı Göçü) Rehberi

Bu doküman, projede kullanılan **Migration (Veritabanı Göçü)** mimarisini, neden kullanıldığını, veritabanı tablolarının mantığını, `package.json` içerisindeki script'leri, ne zaman migration çalıştırılacağını ve değişikliklerin nasıl yönetileceğini detaylı bir şekilde açıklar.

---

## 1. Migration Nedir ve Neden Kullanılır?

**Migration bir veritabanı değildir.** Migration, veritabanınızın **Versiyon Kontrol Sistemi (İnşaat Defteri)**dir.

### 🏢 Gerçek Hayat Benzetmesi
Düşünün ki bir bina inşa ediyorsunuz:
* **`synchronize: true` demek:** *"Tadilat gerektiğinde balyozu al, duvarı yık, baştan yap. İçerideki eşyalar (kullanıcı verileri) kırılırsa veya silinirse umrumda değil."* demektir.
* **`Migration` demek:** *"İnşaat defterine adım adım not yaz: '7 Ekim tarihinde binaya 1 tane yeni pencere (phone sütunu) eklenecek.' Ustaya bu talimatı ver ve deftere 'yapıldı' diye imza at."* demektir.

---

## 2. Neden `synchronize: false` Yaptık?

* `synchronize: true` açık kaldığında TypeORM, projeniz her başladığında veritabanını **zorla** kodunuza eşitlemeye çalışır.
* **Geliştirme aşamasında pratik görünür ancak Canlı Ortamda (Production) Felakettir!** 
  Çünkü canlıdaki bir veritabanında sütun değiştirdiğinizde `synchronize: true` veritabanındaki o tabloyu veya sütunu tamamen silip baştan oluşturabilir. Bu da **tüm gerçek kullanıcı verilerinin silinmesi** demektir.
* Bu yüzden profesyonel projelerde `synchronize: false` yapılır ve tüm değişiklikler **Migration** ile güvenli ve adım adım yapılır.

---

## 3. `package.json` İçerisindeki Migration Script'leri ve Açıklamaları

Projede veritabanı yönetimini kolaylaştırmak için `package.json` dosyasına eklenen script'ler şunlardır:

### 🛠️ 1. `"typeorm": "typeorm-ts-node-commonjs -d db/data-source.ts"`
* **Açıklama:** TypeORM CLI aracını projedeki `db/data-source.ts` ayar dosyası ile bağlayarak çalıştırır. `ts-node` altyapısı kullandığı için `.ts` dosyalarını derlemeden okur. Diğer tüm migration komutları bu temel komutu kullanır.

### 📝 2. `"migration:generate": "npm run typeorm -- migration:generate"`
* **Açıklama:** VS Code içerisindeki Entity kodlarınız ile Neon veritabanı arasındaki farkı karşılaştırır ve `db/migrations/` klasörüne otomatik bir `.ts` migration dosyası üretir.
* **Kullanım:** 
  ```bash
  npm run migration:generate -- db/migrations/add_phone_to_users
  ```

### 🚀 3. `"migration:run": "npm run typeorm -- migration:run"`
* **Açıklama:** `db/migrations/` klasöründe bulunan ve henüz veritabanına uygulanmamış olan tüm migration dosyalarını sırasıyla Neon veritabanında çalıştırır ve tabloları günceller.
* **Kullanım:**
  ```bash
  npm run migration:run
  ```

### ↩️ 4. `"migration:revert": "npm run typeorm -- migration:revert"`
* **Açıklama:** Veritabanına uygulanmış olan en son migration işlemini geri alır (rollback / geri çekme yapar). `down()` metodunu çalıştırır.
* **Kullanım:**
  ```bash
  npm run migration:revert
  ```

### 🗑️ 5. `"db:drop": "npm run typeorm schema:drop"`
* **Açıklama:** Veritabanındaki tüm tabloları ve verileri **tamamen siler** (şemayı sıfırlar).
* **Kullanım:**
  ```bash
  npm run db:drop
  ```
* **⚠️ UYARI:** Sadece geliştirme (development) veya test ortamında sıfırdan başlamak istendiğinde kullanılmalıdır.

---

## 4. Ne Zaman Migration Çalıştırılmalıdır?

### 🟢 Migration Çalıştırmanız GEREKEN Durumlar (Veritabanı Şeması Değişirse):
1. **Yeni bir Entity (Tablo) eklediğinizde** *(Örn: `product.entity.ts`)*.
2. **Var olan bir Entity'ye yeni sütun/alan eklediğinizde** *(Örn: `phone`, `address`)*.
3. **Bir sütunu sildiğinizde veya adını değiştirdiğinizde** *(Örn: `name` $\rightarrow$ `fullName`)*.
4. **Sütun tipini değiştirdiğinizde** *(Örn: `string` $\rightarrow$ `number`)*.
5. **Tablolar arasında ilişki kurduğunuzda** *(Örn: `@ManyToOne`, `@OneToMany`)*.

### 🔴 Migration Çalıştırmanıza GEREK OLMAYAN Durumlar (Kod İçeriği Değişirse):
1. **Service (`user.service.ts`) dosyalarına fonksiyon yazdığınızda.**
2. **Controller (`user.controller.ts`) istekleri/endpoint'leri yazdığınızda.**
3. **DTO (`create-user.dto.ts`) veya Validation eklediğinizde.**
4. **Modül (`user.module.ts`) dosyalarında düzenleme yaptığınızda.**

---

## 5. Neon Veritabanındaki Tabloların Anlamı

Neon konsolunda (`Tables` sekmesinde) iki farklı tablo yapısı görürsünüz:

1. **`users` Tablosu (Asıl Veritabanı Tablonuz):**
   * Kullanıcılarınızın `name`, `email`, `password`, `phone` gibi verilerinin saklandığı gerçek veritabanı tablosudur.

2. **`migrations` Tablosu (TypeORM'in Takip Defteri):**
   * İçinde `id`, `timestamp`, `name` alanları bulunur.
   * Bu tablo sizin kullanıcı verilerinizi saklamaz! TypeORM'in kendi dahili hafızasıdır. 
   * TypeORM buraya bakarak der ki: *"Ben `AddPhoneToUsers1791370397587` adımını veritabanına uyguladım. Proje tekrar başladığında bu adımı bir daha çalıştırmama gerek yok."*

---

## 6. Standart Değişiklik İş Akışı (Adım Adım)

Veritabanına yeni bir sütun veya tablo eklemek istediğinizde uygulayacağınız 3 adım:

```
[1. Kod Değişikliği]  --->  [2. Migration Üretme]  --->  [3. Veritabanına İşleme]
user.entity.ts              migration:generate            migration:run
```

1. **Adım 1 (Kod Yazımı):** VS Code'da `src/users/entities/user.entity.ts` dosyasına yeni alanınızı eklersiniz (Örn: `@Column() phone: string;`).
2. **Adım 2 (Migration Üretme):** Terminalde şu komutu çalıştırırsınız:
   ```bash
   npm run migration:generate -- db/migrations/add_phone_to_users
   ```
   *(TypeORM TypeScript kodunuz ile Neon DB arasındaki farkı anlar ve `db/migrations/` klasörüne otomatik bir `.ts` dosyası üretir).*
3. **Adım 3 (Veritabanına Uygulama):** Terminalde şu komutu çalıştırırsınız:
   ```bash
   npm run migration:run
   ```
   *(TypeORM üretilen dosyayı okur ve Neon PostgreSQL veritabanınıza sütunu ekler).*

---

## 7. Yapılan Bir Değişikliği veya Migration'ı Silmek / Geri Almak (Rollback)

Eklediğiniz bir sütunu (örneğin `phone`) silmek istediğinizde 2 farklı yöntem kullanabilirsiniz:

### **Yöntem A: En Son Yaptığınız Migration'ı Geri Almak (`revert`)**
Henüz yeni uyguladığınız migration'ı geri çekmek için:
```bash
npm run migration:revert
```
* **Ne Olur?** TypeORM Neon veritabanına bağlanır, en son uygulanan sütunu siler ve Neon'daki `migrations` tablosundaki o kaydı kaldırır (`down()` metodunu çalıştırır).

### **Yöntem B: Yeni Bir Migration İle Silmek**
1. VS Code'da `user.entity.ts` içinden `phone` satırını silin ve kaydedin.
2. Terminalde silme migration'ı üretin:
   ```bash
   npm run migration:generate -- db/migrations/remove_phone_from_users
   ```
3. Veritabanına uygulayın:
   ```bash
   npm run migration:run
   ```
   *(TypeORM Neon veritabanındaki `phone` sütununu kaldırır).*

---

## 8. Migration Dosyalarının İç Anatomisi (`up` ve `down` Metotları)

Üretilen her bir migration dosyası (`db/migrations/...ts`) içerisinde iki ana metot barındırır:

```typescript
export class AddPhoneToUsers1791370397587 implements MigrationInterface {

    // 🚀 UP (İleri / Uygula): "npm run migration:run" çalışınca bu metot tetiklenir
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying`);
    }

    // ↩️ DOWN (Geri / İptal Et): "npm run migration:revert" çalışınca bu metot tetiklenir
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
    }
}
```

* **`up()` Metodu:** Siz terminalde `npm run migration:run` çalıştırdığınızda devreye girer. TypeORM bu metodun içindeki SQL komutunu çalıştırarak veritabanına sütunu/tabloyu **EKLER**.
* **`down()` Metodu:** Siz terminalde `npm run migration:revert` çalıştırdığınızda devreye girer. TypeORM bu metodun içindeki SQL komutunu çalıştırarak veritabanındaki sütunu/tabloyu **SİLER**.
