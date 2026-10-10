import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';
import { UserEntity } from 'src/users/entities/user.entity';
import { ProductEntity } from './entities/product.entity';
import { FilterProductDto } from './dto/filter-product.dto';
import { SerializeIncludes, } from 'src/utility/interceptors/serialize.interceptor';
import { ProductDto } from './dto/products.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) { }

  @Post('create')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: UserEntity
  ): Promise<ProductEntity> {
    return await this.productsService.create(createProductDto, currentUser);
  }

  @SerializeIncludes(ProductDto)
  @Get('all')
  async findAll(@Query() query: FilterProductDto): Promise<{
    products: ProductDto[],
    totalProducts: number,
    limit: number
  }> {
    return await this.productsService.findAll(query);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return await this.productsService.update(+id, updateProductDto);
  }

  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async remove(@Param('id') id: string) {
    return await this.productsService.remove(+id);
  }
}
