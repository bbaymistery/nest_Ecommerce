import { BadRequestException, forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';
import { FilterProductDto } from './dto/filter-product.dto';
import { ProductDto } from './dto/products.dto';
import { OrdersService } from 'src/orders/orders.service';

@Injectable()
export class ProductsService {

  constructor(
    // 1. Ürün işlemleri için kendi Product Repository'mizi alıyoruz
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    // 2. Kategori işlemleri için CategoriesModule tarafından
    //  dışa aktarılan CategoriesService'i alıyoruz
    private readonly categoriesService: CategoriesService,

    // 3. Sipariş işlemleri için OrdersModule tarafından (Circular Dependency çözümü için forwardRef)
    @Inject(forwardRef(() => OrdersService))
    private readonly ordersService: OrdersService
  ) { }

  /**
   * Yeni Ürün Ekleme (Create Product)
   * 
   * İş Adımları:
   * 1. Kategori ID'si ile veritabanından ilgili kategoriyi arıyoruz (CategoriesService.findOne).
   *    Eğer kategori yoksa CategoriesService otomatik olarak 404 NotFoundException fırlatır.
   * 2. Ürün nesnesini oluşturup (productRepository.create) DTO verilerini aktarıyoruz.
   * 3. Ürünü ekleyen kullanıcıyı (currentUser) ve bulunan kategoriyi (category) ilişkilendiriyoruz.
   * 4. Veritabanına kaydedip geri döndürüyoruz (save).
   */
  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    // CategoriesService.findOne metodu kategorinin varlığını kontrol eder, yoksa 404 atar
    const category = await this.categoriesService.findOne(createProductDto.categoryId);
    console.log({ category });

    // Ürün nesnesini DTO ile oluşturuyoruz
    const product = this.productRepository.create(createProductDto);

    // İlişkileri kuruyoruz
    product.addedBy = currentUser;
    product.category = category;

    // Veritabanına kaydediyoruz
    return await this.productRepository.save(product);
  }

  async findAll(query: FilterProductDto): Promise<{
    products: ProductDto[],
    totalProducts: number,
    limit: number
  }> {
    let filteredTotalProducts: number;
    let limit = query.limit ? query.limit : 4;

    // 2. TypeORM QueryBuilder Başlatma:
    // ProductEntity tablosu üzerinde 'products' takma adıyla (alias) 
    // bir SQL sorgusu inşa etmeye başlıyoruz.
    const queryBuilder = this.productRepository
      .createQueryBuilder('products')

      // 3. Ürünlerin Kategorisini Sorguya Dahil Etme:
      // Her ürünün bağlı olduğu kategoriyi (category tablosunu) LEFT JOIN ile birleştiriyoruz 
      // ve koda category verisinin çekilmesini sağlıyoruz.
      .leftJoinAndSelect('products.category', 'category')

      // 4. Ürün Yorumlarını (Reviews) Sorguya Dahil Etme:
      // DİKKAT: Buradaki `leftJoinAndSelect` kullanımı terminaldeki hataya sebep oldu (Aşağıda 3. maddede detaylandırıldı).
      // Yorumların puan ortalamasını ve sayısını hesaplamak için review tablosunu birleştiriyoruz.
      .leftJoin('products.reviews', 'review')

      // 5. Özel SQL Hesaplama Alanları (Aggregations) Ekleme:
      // - COUNT(review.id): Ürüne kaç tane yorum yapıldığını sayar -> reviewCount olarak döner.
      // - AVG(review.ratings): Yorumların yıldız/puan ortalamasını alır -> avgRating olarak döner.
      .addSelect([
        'COUNT(review.id) AS reviewCount',
        'AVG(review.ratings)::numeric(10,2) AS avgRating',
      ])

      // 6. Gruplama (GROUP BY):
      // AVG ve COUNT gibi toplu (aggregate) fonksiyonlar kullanıldığı için SQL standartları gereği
      // sonuçların hangi alanlara göre gruplanacağını belirtiyoruz (Ürün ID'si ve Kategori ID'sine göre).
      .groupBy('products.id,category.id');

    // Filtre uygulanmadan önceki toplam ürün sayısını alır.
    const totalProducts = await queryBuilder.getCount();

    // 7. Arama Filtresi (Title SEARCH):
    // Eğer query içinde 'search' geldiyse, başlığında aranan kelime geçen ürünleri filtreler (%kelime%).
    if (query.search) {
      const search = query.search;
      queryBuilder.andWhere('products.title like :title', { title: `%${search}%` });
    }

    // 8. Kategori Filtresi:
    // Eğer belirli bir kategori ID'si gönderildiyse sadece o kategoriye ait ürünleri süzeler.
    if (query.category) {
      queryBuilder.andWhere('category.id=:id', { id: query.category });
    }

    // 9. Minimum Fiyat Filtresi:
    // Fiyatı belirtilen tutardan büyük veya eşit olanları süzeler.
    if (query.minPrice) {
      queryBuilder.andWhere('products.price>=:minPrice', { minPrice: query.minPrice });
    }

    // 10. Maksimum Fiyat Filtresi:
    // Fiyatı belirtilen tutardan küçük veya eşit olanları süzeler.
    if (query.maxPrice) {
      queryBuilder.andWhere('products.price<=:maxPrice', { maxPrice: query.maxPrice });
    }

    // 11. Minimum Ortalama Puan Filtresi (HAVING):
    // DİKKAT: AVG() gibi hesaplanmış (aggregate) alanlar WHERE ile filtrelenmez! 
    // SQL kuralı gereği GROUP BY işleminden sonra HAVING ile filtrelenir.
    if (query.minRating) {
      queryBuilder.andHaving('AVG(review.ratings)>=:minRating', { minRating: query.minRating });
    }

    // 12. Maksimum Ortalama Puan Filtresi:
    if (query.maxRating) {
      queryBuilder.andHaving('AVG(review.ratings)<=:maxRating', { maxRating: query.maxRating });
    }

    // 13. Sayfalama (Pagination - Limit & Offset):
    // Getirilecek maksimum kayıt sayısı
    queryBuilder.limit(limit);

    // Kaçıncı kayıttan başlanacağı (Örn: 2. sayfa için offset: 4)
    if (query.offset) {
      queryBuilder.offset(query.offset);
    }

    // 14. Sonuçları Ham (Raw) Format Olarak Alma:
    // getMany() standart entity nesnesi döndürürken; getRawMany() `addSelect` ile eklediğimiz
    // `reviewCount` ve `avgRating` gibi hesaplanmış ham SQL alanlarını da içeren verileri döner.
    const products = await queryBuilder.getRawMany();
    return {
      products,
      totalProducts,
      limit
    };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        addedBy: true,
      },
      select: {
        category: {
          id: true,
          title: true,
          description: true, // 👈 Sadece istedikleriniz çekilir
        },
        addedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Ürün (#${id}) bulunamadı.`);
    }

    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto): Promise<ProductEntity> {
    // 1. Ürün var mı kontrol et (yoksa 404 atar)
    const product = await this.findOne(id);

    // 2. DTO verilerini mevcut ürün nesnesinin üzerine kopyala
    Object.assign(product, updateProductDto);

    // 3. Eğer kategori ID değiştirilmek istenmişse yeni kategoriyi kontrol et ve ata
    if (updateProductDto.categoryId) {
      const category = await this.categoriesService.findOne(updateProductDto.categoryId);
      product.category = category;
    }

    return await this.productRepository.save(product);
  }

  /**
   * ÜRÜN SİLME (Delete Product)
   * 
   * İş Kuralı:
   * Bir ürünü silmeden önce bu ürünün daha önceden verilmiş herhangi bir siparişte (Order) 
   * yer alıp almadığını kontrol ediyoruz. Eğer ürün siparişlerde varsa veritabanından 
   * silinmesine izin verilmez (400 BadRequestException atılır).
   */
  async remove(id: number): Promise<ProductEntity> {
    const product = await this.findOne(id);

    // 1. Bu ürün daha önce herhangi bir siparişte yer almış mı kontrol et:
    const order = await this.ordersService.findOneByProductId(product.id);

    // 2. Eğer siparişte geçmişi varsa veritabanından silinmesine izin VERME (Hata fırlat):
    if (order) throw new BadRequestException("Product is in use");

    // 3. Siparişi yoksa güvenle sil:
    return await this.productRepository.remove(product);
  }


  /**
   * ÜRÜN STOK GÜNCELLEME (Stock Update)
   * 
   * @param id Ürün ID'si
   * @param stockQuantity Sipariş edilen/iptal edilen adet
   * @param status Sipariş durumu (DELIVERED ise stok düşer, CANCELLED ise stok geri iade edilir)
   */
  async updateStock(id: number, stockQuantity: number, status: string) {
    const product = await this.findOne(id);

    if (status === 'delivered') {
      product.stock -= stockQuantity; // Teslim edildiğinde stoktan düşürülür
    } else {
      product.stock += stockQuantity; // İptal edildiğinde stok geri iade edilir
    }

    return await this.productRepository.save(product);
  }
}
