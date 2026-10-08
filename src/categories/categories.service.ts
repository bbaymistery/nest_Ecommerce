import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/category.entity';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/users/entities/user.entity';

@Injectable()
export class CategoriesService {

  constructor(
    @InjectRepository(CategoryEntity)
    private categoryRepository: Repository<CategoryEntity>,
  ) { }

  async create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<CategoryEntity> {
    const category = this.categoryRepository.create(createCategoryDto);
    category.addedBy = currentUser;
    if (category.is_active === undefined) {
      category.is_active = true;
    }
    return await this.categoryRepository.save(category);
  }

  async findAll(): Promise<CategoryEntity[]> {
    return await this.categoryRepository.find({
      relations: {
        addedBy: true,
      },
    });
  }

  async findOne(id: number): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        addedBy: true,
      },
    });

    if (!category) {
      throw new NotFoundException(`Kategori (#${id}) bulunamadıiii.`);
    }

    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<CategoryEntity> {
    // findOne yardımcısı kategorinin varlığını kontrol eder, yoksa tek noktadan NotFoundException fırlatır
    const category = await this.findOne(id);

    // Gelen DTO verilerini mevcut kategori nesnesinin üzerine kopyalıyoruz
    //Object.assign(hedef, kaynak) mantığı şudur:
    Object.assign(category, updateCategoryDto);

    return await this.categoryRepository.save(category);
  }

  async remove(id: number): Promise<CategoryEntity> {
    const category = await this.findOne(id);
    return await this.categoryRepository.remove(category);
  }
}
