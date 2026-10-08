import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductEntity } from './entities/product.entity';
import { Repository } from 'typeorm';
import { CategoryEntity } from 'src/categories/entities/category.entity';
import { UserEntity } from 'src/users/entities/user.entity';
export declare class ProductsService {
    private productRepository;
    private categoryRepository;
    constructor(productRepository: Repository<ProductEntity>, categoryRepository: Repository<CategoryEntity>);
    create(createProductDto: CreateProductDto, currentUser: UserEntity): Promise<ProductEntity>;
    findAll(): Promise<string>;
    findOne(id: number): string;
    update(id: number, updateProductDto: UpdateProductDto): string;
    remove(id: number): string;
}
