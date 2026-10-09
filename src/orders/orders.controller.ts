import { Controller, Get, Post, Put, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthenticationGuard } from 'src/utility/guards/authentication.guard';
import { AuthorizeGuard } from 'src/utility/guards/authorization.guard';
import { Roles } from 'src/utility/common/user-roles.enum';
import { UserEntity } from 'src/users/entities/user.entity';
import { CurrentUser } from 'src/utility/decorators/current-user.decorator';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @Post()
  @UseGuards(AuthenticationGuard)
  async create(@Body() createOrderDto: CreateOrderDto, @CurrentUser() currentUser: UserEntity) {
    return await this.ordersService.create(createOrderDto, currentUser);
  }

  @Get()
  async findAll() {
    return await this.ordersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.ordersService.findOne(+id);
  }

  /**
   * SİPARİŞ İPTAL ETME (Put /orders/cancel/:id)
   * Admin yetkilisi siparişi iptal eder (CANCELLED) ve ürün stoklarını iade eder.
   */
  @Put('cancel/:id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async cancelled(
    @Param('id') id: string,
    @CurrentUser() currentUser: UserEntity
  ) {
    return await this.ordersService.cancelled(+id, currentUser);
  }

  /**
   * SİPARİŞ DURUMU GÜNCELLEME (Patch /orders/:id)
   * Sadece Admin yetkisine sahip giriş yapmış kullanıcılar sipariş durumunu değiştirebilir.
   */
  @Patch(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: UpdateOrderDto,
    @CurrentUser() currentUser: UserEntity
  ) {
    return await this.ordersService.update(+id, updateOrderDto, currentUser);
  }

  /**
   * SİPARİŞİ VERİTABANINDAN SİLME (Delete /orders/:id)
   * Sadece Admin yetkisine sahip kullanıcılar siparişi tamamen (Neon DB'den) silebilir.
   */
  @Delete(':id')
  @UseGuards(AuthenticationGuard, AuthorizeGuard(Roles.ADMIN))
  async remove(@Param('id') id: string) {
    return await this.ordersService.remove(+id);
  }
}

