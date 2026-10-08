import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class ProductsService {


  constructor(
    @InjectRepository(ProductEntity) private productRepository: Repository<ProductEntity>,
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity> {
    const category = await this.categoryRepository.findOne({ where: { id: createProductDto.categoryId } });
    if (!category) {
      throw new NotFoundException("Category not found");
    }

    //asagidaki ile eynidi this.productRepository.create(createProductDto);
    //p =Object.assign(ProductEntity,createProductDto)
    const product = this.productRepository.create(createProductDto);
    product.addedBy = currentUser;
    product.category = category;
    return await this.productRepository.save(product);
  }

  async findAll() {
    return `This action returns all products`;
  }

  findOne(id: number) {
    return `This action returns a #${id} product`;
  }

  update(id: number, updateProductDto: UpdateProductDto) {
    return `This action updates a #${id} product`;
  }

  remove(id: number) {
    return `This action removes a #${id} product`;
  }
}
