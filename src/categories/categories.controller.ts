import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async create(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() currentUser: UserEntity) {
    return await this.categoriesService.create(createCategoryDto, currentUser);
  }

  @Get('all')
  async findAll() {
    return await this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.categoriesService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return await this.categoriesService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async remove(@Param('id') id: string) {
    return await this.categoriesService.remove(+id);
  }
}
