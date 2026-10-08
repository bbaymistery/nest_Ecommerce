import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { UserEntity } from 'src/users/entities/user.entity';
export declare class CategoriesController {
    private readonly categoriesService;
    constructor(categoriesService: CategoriesService);
    create(createCategoryDto: CreateCategoryDto, currentUser: UserEntity): Promise<import("./entities/category.entity").CategoryEntity>;
    findAll(): Promise<import("./entities/category.entity").CategoryEntity[]>;
    findOne(id: string): Promise<import("./entities/category.entity").CategoryEntity>;
    update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<import("./entities/category.entity").CategoryEntity>;
    remove(id: string): Promise<import("./entities/category.entity").CategoryEntity>;
}
