# CurrentUserMiddleware ve @CurrentUser() Dekoratörü Çalışma Mantığı

Bu doküman, NestJS projesinde kimlik doğrulama (Authentication), `CurrentUserMiddleware`, `@CurrentUser()` parametre dekoratörü ve `declare global` yapısının mimari çalışma prensiplerini açıklamaktadır.

---

## 1. `Authorization: Bearer <Token>` Standartı ve 401 Hatası

### Problem:
Postman veya API istemcilerinde `Authorization` başlığına (Header) sadece ham Token metni yapıştırıldığında (`eyJhbGci...`), sunucudan **`401 UnauthorizedException: Geçerli bir Token bulunamadı`** hatası alınır.

### Sebebi:
HTTP ve JWT standartlarına göre `Authorization` başlığı `Bearer ` eki ile başlamalıdır. Middleware kodumuzdaki şart:

```typescript
if (!authHeader || isArray(authHeader) || !authHeader.startsWith('Bearer ')) {
  req.currentUser = undefined;
  return next();
}
```

### Çözüm:
Postman `Authorization` Header değerinin başına **`Bearer `** (arkasında bir boşluk bırakarak) eklenmelidir:
* ❌ **Yanlış:** `eyJhbGciOiJIUzI1...`
* ✅ **Doğru:** `Bearer eyJhbGciOiJIUzI1...`

---

## 2. Neden `getProfile` (@Get('me')) İçin Ekstra Service Metodu Yazılmadı?

### İstek Akışı (Request Lifecycle):

```
[İstemci İstek Atar] (GET /api/v1/users/me)
       │
       ▼
[CurrentUserMiddleware]
  1. Header'dan `Bearer <Token>` bilgisini okur.
  2. `jwt.verify()` ile Token şifresini çözer ve içerisindeki `id` bilgisini alır.
  3. `this.usersService.findById(+id)` metodunu çalıştırarak veritabanından kullanıcıyı çeker.
  4. Kullanıcıyı `req.currentUser = currentUser` diyerek isteğe yapıştırır.
       │
       ▼
[UsersController (@Get('me'))]
  1. `@CurrentUser()` dekoratörü `req.currentUser` nesnesini çeker.
  2. Kullanıcı verisi zaten hafızada (RAM) hazır olduğu için doğrudan döndürür.
```

### Mimari Avantajı:
Kullanıcı veritabanından **zaten Middleware seviyesinde çekildiği için**, Controller içinde tekrar bir `usersService.getProfile()` çağırmamıza gerek kalmaz. Bu sayede gereksiz veritabanı sorguları önlenir ve kod DRY (Don't Repeat Yourself) prensibine uygun hale gelir.

---

## 3. Klasik İstek Akışı ile Middleware Akışının Karşılaştırılması

### A. Klasik / Normal İstek Akışı (Örn: `GET /users/5`)
1. **İstemci** isteği atar.
2. İstek **Controller**'a ulaşır.
3. **Controller** ──► **Service**'e gider (`this.usersService.findById(5)`).
4. **Service** ──► **Veritabanına (Repository)** gider, veriyi çeker ve **Controller**'a döner.
5. **Controller** ──► Yanıtı **İstemci**ye gönderir.

### B. Bizim `GET /users/me` (Profil) İstek Akışı
1. **İstemci** isteği atar.
2. İstek **Controller'a daha ulaşmadan** kapıdaki görevli olan **Middleware** isteği yakalar.
3. **Middleware** ──► **Service** üzerinden veritabanına gider (`usersService.findById()`), kullanıcıyı bulur ve isteğin çantasına (`req.currentUser`) koyar.
4. **Middleware** isteği **Controller**'a devreder.
5. **Controller** zaten çantada (RAM'de) hazır olan `currentUser` nesnesini alır ve hiçbir Service'e gitmeden doğrudan **İstemci**ye yanıtı döner.

---

## 4. `declare global` ve Interface Merging Mantığı

```typescript
declare global {
  namespace Express {
    interface Request {
      currentUser?: UserEntity;
    }
  }
}
```

### Neden Gerekli?
Express.js kütüphanesinin varsayılan `Request` arabirimi `currentUser` adında bir özellik tanımaz. TypeScript bu alana erişmeye çalıştığımızda derleme hatası verir.

* **`declare global`**: Dosyada `import`/`export` olsa dahi tanımın tüm projede (global) geçerli olmasını sağlar.
* **`namespace Express` & `interface Request`**: Express'in var olan `Request` arabirimini hedef alır. TypeScript aynı isimdeki arayüzleri otomatik olarak birleştirir (**Interface Merging**).
* **`currentUser?: UserEntity`**: `req.currentUser` özelliğini opsiyonel olarak `UserEntity` tipinde tanımlar. Bu sayede hem derleme hataları engellenir hem de IDE üzerinde otomatik tamamlama (IntelliSense) desteği sağlanır.
