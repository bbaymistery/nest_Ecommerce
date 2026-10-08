import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {

  constructor(
    // 1. Ürün işlemleri için kendi Product Repository'mizi alıyoruz
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,

    // 2. Kategori işlemleri için CategoriesModule tarafından
    //  dışa aktarılan CategoriesService'i alıyoruz
    private readonly categoriesService: CategoriesService,
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
    console.log({ product });

    // İlişkileri kuruyoruz
    product.addedBy = currentUser;
    product.category = category;

    // Veritabanına kaydediyoruz
    return await this.productRepository.save(product);
  }

  async findAll(): Promise<ProductEntity[]> {
    return await this.productRepository.find({
      relations: {
        category: true,
        addedBy: true,
      },
      select: {
        addedBy: {
          id: true,
          name: true,
          email: true
        },
        category: {
          id: true,
          title: true
        }
      }
    });
  }

  async findOne(id: number): Promise<ProductEntity> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: {
        category: true,
        addedBy: true,
      }
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

  async remove(id: number): Promise<ProductEntity> {
    const product = await this.findOne(id);
    return await this.productRepository.remove(product);
  }
}
